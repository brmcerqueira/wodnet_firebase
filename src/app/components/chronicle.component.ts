import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Observable} from 'rxjs/Observable';
import {from} from '../observable.extensions';
import {Subject} from "rxjs/Subject";

@Component({
  templateUrl: './chronicle.component.html'
})
export class ChronicleComponent {

  private chronicleId: string;
  public characters: Observable<SnapshotAction[]>;
  private daoCharacters: AngularFireList<any>;
  private current: SnapshotAction;
  public characterSubject: Subject<Character>;

  constructor(private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private blocker: Blocker) {
    this.chronicleId = this.activatedRoute.snapshot.params['key'];
    this.characterSubject = new Subject();
    this.current = null;

    this.daoCharacters = database.list('characters',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId));
    this.characters = this.daoCharacters.snapshotChanges();
  }

  public characterChange(snapshotAction: SnapshotAction): void {
    this.current = snapshotAction;
    this.characterSubject.next(snapshotAction.payload.val());
  }

  public save(character: Character): void {
    from(this.daoCharacters.push(character)).blocker(this.blocker).subscribe(r => console.log(r.key));
  }
}
