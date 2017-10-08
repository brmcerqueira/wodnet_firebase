import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../../blocker';
import {Character} from '../../character';
import {Observable} from 'rxjs/Observable';
import {fromPromise, fromThenable} from '../../observable.extensions';
import {Subject} from 'rxjs/Subject';
import {AngularFireAuth} from 'angularfire2/auth';
import {Virtue} from '../../virtue';
import {Vice} from '../../vice';
import {Clan} from '../../clan';
import {Location} from '@angular/common';

@Component({
  templateUrl: './chronicle.component.html',
  styleUrls: ['./chronicle.component.scss']
})
export class ChronicleComponent {

  private chronicleId: string;
  public characters: Observable<SnapshotAction[]>;
  private daoCharacters: AngularFireList<any>;
  private characterKey: string;
  public characterSubject: Subject<Character>;

  constructor(private activatedRoute: ActivatedRoute,
              private location: Location,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.chronicleId = this.activatedRoute.snapshot.params['key'];
    this.characterSubject = new Subject();
    this.characterKey = null;

    this.daoCharacters = database.list('characters',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId));
    this.characters = this.daoCharacters.snapshotChanges();
  }

  public characterChange(snapshotAction: SnapshotAction): void {
    this.characterKey = snapshotAction.key;
    this.characterSubject.next(snapshotAction.payload.val());
  }

  public newCharacter(): void {
    this.characterKey = null;
    this.characterSubject.next({
      name: '',
      ownerId: this.angularFireAuth.auth.currentUser.uid,
      storytellerId: this.angularFireAuth.auth.currentUser.uid,
      chronicleId: this.chronicleId,
      isOpen: false,
      virtue: Virtue.Ambitious,
      vice: Vice.Addictive,
      clan: Clan.Brujah,
      strength: 1,
      dexterity: 1,
      stamina: 1,
      charisma: 1,
      manipulation: 1,
      appearance: 1,
      perception: 1,
      intelligence: 1,
      wits: 1,
      humanity: 7,
      touchstones: '',
      backgroundsAndMerits: '',
      superficialDamage: 0,
      aggravatedDamage: 0,
      consolidateWillpower: 0,
      willpower: 0,
      consolidateComposure: 0,
      composure: 0,
      hunger: 1,
      physical: {
        athletics: 0,
        brawl: 0,
        crafts: 0,
        dodge: 0,
        drive: 0,
        melee: 0,
        security: 0,
        stealth: 0,
        survival: 0
      },
      social: {
        animalKen: 0,
        empathy: 0,
        etiquette: 0,
        intimidation: 0,
        leadership: 0,
        performance: 0,
        persuasion: 0,
        streetwise: 0,
        subterfuge: 0
      },
      mental: {
        academics: 0,
        awareness: 0,
        firearms: 0,
        investigation: 0,
        linguistics: 0,
        medicine: 0,
        occult: 0,
        science: 0,
        technology: 0
      },
      disciplines: {}
    });
  }

  public save(character: Character): void {
    if (this.characterKey) {
      fromPromise<void, Promise<void>>(this.daoCharacters.update(this.characterKey, character)).blocker(this.blocker).subscribe();
    }
    else {
      fromThenable(this.daoCharacters.push(character)).blocker(this.blocker).subscribe(r => this.characterKey = r.key);
    }
  }
  public goBack(): void {
    this.location.back();
  }
}
