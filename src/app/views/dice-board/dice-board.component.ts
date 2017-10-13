import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Character} from '../../character';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {SelectSource} from '../../select.source';
import {SelectItem} from '../../select.item';
import {dicePolls} from '../../dice.poll';
import {TranslateService} from '@ngx-translate/core';

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
  characterName: string;
  player: string;
  playerPhoto: string;
  successes: number;
  dices: number[];
  hungerDices: number[];
  state: RollState;
  hungerState: HungerState;
  description?: string;
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
  public dicePollRollFormGroup: FormGroup;
  private daoRolls: AngularFireList<any>;
  public characters: Observable<SnapshotAction[]>;
  public readSubject: Subject<boolean>;
  private subscription: Subscription;
  public character: Character;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth) {
    this.isStoryteller = activatedRoute.snapshot.data.isStoryteller;
    this.chronicleId = this.activatedRoute.snapshot.params['key'];

    this.customRollFormGroup = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
      hunger: [1, [Validators.required, Validators.min(0), Validators.max(5)]]
    });

    this.dicePollRollFormGroup = this.formBuilder.group({
      dicePoll: [null, Validators.required],
      modifier: [0, [Validators.required, Validators.min(-10), Validators.max(10)]]
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

  public dicePollRoll(): void {
    const data = this.dicePollRollFormGroup.value;
    const dicePoll = dicePolls[data.dicePoll];
    this.roll(dicePoll.get(this.character) + data.modifier,
      dicePoll.withHunger ? this.character.hunger : 0,
      data.dicePoll);
  }

  private roll(amount: number, hunger: number, description?: string): void {
    const roll: Roll = {
      chronicleId: this.chronicleId,
      characterName: this.character ? this.character.name : null,
      player: this.angularFireAuth.auth.currentUser.displayName,
      playerPhoto: this.angularFireAuth.auth.currentUser.photoURL,
      successes: 0,
      dices: [],
      hungerDices: [],
      state: RollState.Failure,
      hungerState: HungerState.None
    };

    if (description) {
      roll.description = description;
    }

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

  public get dicePolls(): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return Observable.create(s => {
        s.next(Object.keys(dicePolls).map(name => {
            return {
              id: name,
              text: <string> this.translate.instant(name)
            };
          }).filter(item => {
            const has = dicePolls[item.id].has;
            return ((has && has(this.character)) || !has) && item.text.toLowerCase().indexOf(data) > -1;
          }).sort((l, r) => l.text > r.text ? 1 : (r.text > l.text ? -1 : 0)));
      });
    };
  }

  private sortDices(l: number, r: number): number {
    return l > r ? -1 : (r > l ? 1 : 0);
  }

  private get dice(): number {
    return Math.floor((Math.random() * 10) + 1);
  }
}
