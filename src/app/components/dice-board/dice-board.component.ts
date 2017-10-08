import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Character} from '../../character';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

enum RollState {
  Failure,
  Success,
  MessyCritical,
  CriticalSuccess
}

enum HungerState {
  None,
  Distracted,
  Compulsion,
}

export interface Roll {
  chronicleId: string;
  player: string;
  playerPhoto: string;
  successes: number;
  dices: number[];
  hungerDices: number[];
  state: RollState;
  hungerState: HungerState;
}

@Component({
  templateUrl: './dice-board.component.html',
  styleUrls: ['./dice-board.component.scss']
})
export class DiceBoardComponent {


  private chronicleId: string;
  public isStoryteller: boolean;
  public rolls: Observable<Roll[]>;
  public customRollFormGroup: FormGroup;
  private daoRolls: AngularFireList<any>;
  public characters: Observable<SnapshotAction[]>;
  public readSubject: Subject<boolean>;
  private subscription: Subscription;
  public character: Character;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth) {
    this.isStoryteller = activatedRoute.snapshot.data.isStoryteller;
    this.chronicleId = this.activatedRoute.snapshot.params['key'];

    this.customRollFormGroup = this.formBuilder.group({
      amount: 1,
      hunger: 1
    });

    if (this.isStoryteller) {
      this.characters = database.list('characters',
        r => r.orderByChild('chronicleId').equalTo(this.chronicleId)).snapshotChanges().map(c => {
          this.readSubject.next(true);
          return c;
      });
    }

    this.character = null;
    this.readSubject = new Subject();

    const characterKey = this.activatedRoute.snapshot.params['characterKey'];

    if (characterKey) {
      this.observeCharacter(characterKey);
    }

    this.daoRolls = database.list('rolls',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId).limitToLast(10));
    this.rolls = this.daoRolls.valueChanges().map(array => array.reverse());
  }

  private observeCharacter(characterKey: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (characterKey) {
      this.subscription = this.database.object(`characters/${characterKey}`)
        .valueChanges<Character>().subscribe(c => {
        this.customRollFormGroup.controls.hunger.setValue(c.hunger);
        this.character = c;
        this.readSubject.next(true);
      });
    }
    else {
      this.customRollFormGroup.controls.hunger.setValue(1);
      this.readSubject.next(true);
    }
  }

  public customRoll(): void {
    const data = this.customRollFormGroup.value;
    this.roll(data.amount, data.hunger);
  }

  private roll(amount: number, hunger: number): void {
    const roll: Roll = {
      chronicleId: this.chronicleId,
      player: this.angularFireAuth.auth.currentUser.displayName,
      playerPhoto: this.angularFireAuth.auth.currentUser.photoURL,
      successes: 0,
      dices: [],
      hungerDices: [],
      state: RollState.Failure,
      hungerState: HungerState.None
    };

    let criticals = 0;
    let hungerCriticals = 0;
    let hungerArise = 0;

    if (amount <= 0) {
      amount = 1;
    }

    const totalHungerDices = hunger > amount ? amount : hunger;

    for (let i = 0; i < totalHungerDices; i++) {
      const dice = this.dice;
      if (dice >= 6) {
        roll.successes++;
        if (dice === 10) {
          hungerCriticals++;
        }
      }
      else if (dice === 1) {
        hungerArise++;
      }
      roll.hungerDices.push(dice);
    }

    const totalDices = amount - hunger;

    for (let i = 0; i < totalDices; i++) {
      const dice = this.dice;
      if (dice >= 6) {
        roll.successes++;
        if (dice === 10) {
          criticals++;
        }
      }
      roll.dices.push(dice);
    }

    if (criticals >= 2) {
      roll.state = RollState.CriticalSuccess;
    }
    else if (hungerCriticals >= 2) {
      roll.state = RollState.MessyCritical;
    }
    else if (roll.successes >= 1) {
      roll.state = RollState.Success;
    }

    if (hungerArise >= 2) {
      roll.hungerState = HungerState.Compulsion;
    }
    else if (hungerArise === 1) {
      roll.hungerState = HungerState.Distracted;
    }

    roll.hungerDices.sort(this.sortDices);
    roll.dices.sort(this.sortDices);

    this.daoRolls.push(roll);
  }

  public goSetup(): void {
    this.router.navigate(this.isStoryteller
      ? ['in/chronicle', this.chronicleId]
      : ['in/player', this.activatedRoute.snapshot.params['characterKey']]);
  }

  private sortDices(l: number, r: number): number {
    return l > r ? -1 : (r > l ? 1 : 0);
  }

  private get dice(): number {
    return Math.floor((Math.random() * 10) + 1);
  }
}
