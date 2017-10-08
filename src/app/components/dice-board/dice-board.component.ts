import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {Character} from "../../character";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AngularFireAuth} from "angularfire2/auth";

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
  ownerId: string;
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
  public formGroup: FormGroup;
  private daoRolls: AngularFireList<any>;
  private characterObservable?: Observable<Character>;

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth) {
    this.isStoryteller = activatedRoute.snapshot.data.isStoryteller;
    this.chronicleId = this.activatedRoute.snapshot.params['key'];

    this.formGroup = this.formBuilder.group({
      amount: 0,
      hunger: 0
    });

    const characterKey = this.activatedRoute.snapshot.params['characterKey'];

    if (characterKey) {
      this.characterObservable = database.object(`characters/${characterKey}`).valueChanges();
    }

    this.daoRolls = database.list('rolls',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId).limitToLast(10));
    this.rolls = this.daoRolls.valueChanges().map(array => array.reverse());
  }

  public roll(): void {
    const data = this.formGroup.value;
    this.roll2(data.amount, data.hunger);
  }

  public roll2(amount: number, hunger: number): void {

    const roll: Roll = {
      chronicleId: this.chronicleId,
      ownerId: this.angularFireAuth.auth.currentUser.uid,
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

    this.daoRolls.push(roll);
  }

  private get dice(): number {
    return Math.floor((Math.random() * 10) + 1);
  }
}
