import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../../blocker';
import {Observable} from 'rxjs/Observable';
import {fromPromise, fromThenable} from '../../observable.extensions';
import {Subject} from 'rxjs/Subject';
import {AngularFireAuth} from 'angularfire2/auth';

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
      isOpen: false
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
}
