import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../../blocker';
import {Character} from '../../character';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from '../../observable.extensions';
import {Subject} from 'rxjs/Subject';
import {AngularFireAuth} from 'angularfire2/auth';
import {Clan} from '../../clan';
import {Predator} from "../../predator";

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
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.chronicleId = this.activatedRoute.snapshot.params['chronicleKey'];
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
      experience: 0,
      generation: 16,
      predator: Predator.Alleycat,
      clan: Clan.Brujah,
      strength: 1,
      dexterity: 1,
      stamina: 1,
      charisma: 1,
      manipulation: 1,
      composure: 1,
      intelligence: 1,
      wits: 1,
      resolve: 1,
      humanity: {
        superficial: 0,
        aggravated: 7
      },
      touchstones: '',
      backgroundsAndMerits: '',
      health: {
        superficial: 0,
        aggravated: 0
      },
      willpower: {
        superficial: 0,
        aggravated: 0
      },
      bloodPotency: 0,
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
      specializations: [],
      disciplines: {}
    });
  }

  public save(character: Character): void {
    if (this.characterKey) {
      fromPromise(this.daoCharacters.update(this.characterKey, character)).pipe(this.blocker.toPipe()).subscribe();
    }
    else {
      fromPromise(this.daoCharacters.push(character)).pipe(this.blocker.toPipe()).subscribe(r => this.characterKey = r.key);
    }
  }
}
