import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
import {adjuncts} from '../../adjunct';
import {specializations} from '../../specialization';
import {map} from "rxjs/operators";
import {Blocker} from "../../blocker";

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
  when: number;
  detail: RollDetail;
  dicePoll?: string;
  adjuncts?: string[];
}

export interface RollDetail {
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

  public rollState = RollState;
  public hungerState = HungerState;

  private readonly chronicleId: string;
  public isShowPlayAccordionWhenCollapse: boolean;
  public isStoryteller: boolean;
  public rolls: Observable<Roll[]>;
  public customRollFormGroup: FormGroup;
  public dicePollRollFormGroup: FormGroup;
  private daoRolls: AngularFireList<any>;
  public characters: Observable<SnapshotAction[]>;
  private subscription: Subscription;
  public character: Character;
  public charactersBlocker: Blocker;

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth) {
    this.isStoryteller = activatedRoute.snapshot.data.isStoryteller;
    this.chronicleId = this.activatedRoute.snapshot.params.chronicleKey;
    this.isShowPlayAccordionWhenCollapse = false;
    this.charactersBlocker = new Blocker();

    this.customRollFormGroup = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
      hunger: [1, [Validators.required, Validators.min(0), Validators.max(5)]]
    });

    this.dicePollRollFormGroup = this.formBuilder.group({
      dicePoll: [null, Validators.required],
      adjuncts: null,
      modifier: [0, [Validators.required, Validators.min(-10), Validators.max(10)]]
    });

    if (this.isStoryteller) {
      this.characters = database.list('characters',
        r => r.orderByChild('chronicleId').equalTo(this.chronicleId)).snapshotChanges().pipe(this.charactersBlocker.toPipe());
    }

    this.character = null;

    const characterKey = this.activatedRoute.snapshot.params['characterKey'];

    if (characterKey) {
      this.observeCharacter(characterKey);
    }

    this.daoRolls = database.list('rolls',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId).limitToLast(10));
    this.rolls = this.daoRolls.valueChanges().pipe(map(array => array.reverse()));
  }

  private observeCharacter(characterKey: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (characterKey) {
      this.subscription = this.database.object<Character>(`characters/${characterKey}`)
        .valueChanges().subscribe(c => {
        this.customRollFormGroup.controls.hunger.setValue(c.hunger);
        this.character = c;
      });
    }
    else {
      this.character = null;
      this.customRollFormGroup.controls.hunger.setValue(1);
    }
  }

  public chooseDicePoll(): void {
    this.dicePollRollFormGroup.controls.adjuncts.setValue(null);
  }

  public customRoll(): void {
    const data = this.customRollFormGroup.value;
    this.daoRolls.push(this.createRoll(this.roll(data.amount, data.hunger)));
  }

  public dicePollRoll(): void {
    const data = this.dicePollRollFormGroup.value;
    const dicePoll = dicePolls[data.dicePoll];
    let amount = 0;
    let automatic = 0;

    let adjunctsResult: string[] = null;

    if (data.adjuncts) {
      adjunctsResult = (<any[]>data.adjuncts).map(i => {
        if (adjuncts[i]) {
          if (adjuncts[i].automatic) {
            automatic += adjuncts[i].get(this.character);
          }
          else {
            amount += adjuncts[i].get(this.character);
          }
        }
        else {
          amount += 1;
        }
        return i;
      });
    }

    const roll = this.createRoll(this.roll(dicePoll.get(this.character) + data.modifier + amount,
      dicePoll.withHunger ? this.character.hunger : 0));

    if (data.dicePoll) {
      roll.dicePoll = data.dicePoll;
    }

    if (adjunctsResult) {
      roll.adjuncts = adjunctsResult;
    }

    roll.detail.successes += automatic;

    this.daoRolls.push(roll);
  }

  private createRoll(detail: RollDetail): Roll {
    return {
      chronicleId: this.chronicleId,
      characterName: this.character ? this.character.name : null,
      player: this.angularFireAuth.auth.currentUser.displayName,
      playerPhoto: this.angularFireAuth.auth.currentUser.photoURL,
      when: new Date().valueOf(),
      detail: detail
    };
  }

  private roll(amount: number, hunger: number): RollDetail {
    const detail: RollDetail = {
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
        detail.successes++;
        if (dice === 10) {
          hungerCriticals++;
        }
      }
      else if (dice === 1) {
        hungerArise++;
      }
      detail.hungerDices.push(dice);
    }

    const totalDices = amount - hunger;

    for (let i = 0; i < totalDices; i++) {
      const dice = this.dice;
      if (dice >= 6) {
        detail.successes++;
        if (dice === 10) {
          criticals++;
        }
      }
      detail.dices.push(dice);
    }

    if (criticals >= 2) {
      detail.state = RollState.CriticalSuccess;
    }
    else if (hungerCriticals >= 2) {
      detail.state = RollState.MessyCritical;
    }
    else if (detail.successes >= 1) {
      detail.state = RollState.Success;
    }

    if (hungerArise >= 2) {
      detail.hungerState = HungerState.Compulsion;
    }
    else if (hungerArise === 1) {
      detail.hungerState = HungerState.Distracted;
    }

    detail.hungerDices.sort(this.sortDices);
    detail.dices.sort(this.sortDices);

    return detail;
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

  public get adjunctsSource(): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return Observable.create(s => {
        if (this.dicePollRollFormGroup.controls.dicePoll.value) {
          const tags = dicePolls[this.dicePollRollFormGroup.controls.dicePoll.value].tags;
          s.next(Object.keys(this.character.specializations || []).map(index => {
            const key = this.character.specializations[index];
            return {
              id: key,
              text: <string> this.translate.instant(key)
            };
          }).filter(item => {
            return tags.indexOf(specializations[item.id]) > -1 && item.text.toLowerCase().indexOf(data) > -1;
          }).concat(Object.keys(adjuncts).map(name => {
            return {
              id: name,
              text: <string> this.translate.instant(name)
            };
          }).filter(item => {
            const has = adjuncts[item.id].has;
            return ((has && has(this.character, tags)) || !has) && item.text.toLowerCase().indexOf(data) > -1;
          })).sort((l, r) => l.text > r.text ? 1 : (r.text > l.text ? -1 : 0)));
        }
        else {
          s.next([]);
        }
      });
    };
  }

  public noHunger(): void {
    const hunger = this.customRollFormGroup.controls.hunger;
    if (hunger.value > 0) {
      hunger.setValue(0);
    }
    else {
      hunger.setValue(this.character.hunger);
    }
  }

  public showPlayAccordion(): void {
    this.isShowPlayAccordionWhenCollapse = !this.isShowPlayAccordionWhenCollapse;
  }

  private sortDices(l: number, r: number): number {
    return l > r ? -1 : (r > l ? 1 : 0);
  }

  private get dice(): number {
    return Math.floor((Math.random() * 10) + 1);
  }
}
