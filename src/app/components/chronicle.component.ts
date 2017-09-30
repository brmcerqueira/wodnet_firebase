import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Observable} from 'rxjs/Observable';
import {from} from '../observable.extensions';

interface SelectItem<TKey, TValue> {
  key: TKey;
  value: TValue;
}

interface Character {
  name: string;
  ownerId: string;
  storytellerId: string;
  chronicleId: string;
  isOpen: boolean;
}

@Component({
  templateUrl: './chronicle.component.html'
})
export class ChronicleComponent {

  private key: string;
  public characters: Observable<SelectItem<string, Character>[]>;
  public current: Character;
  private daoCharacters: AngularFireList<any>;

  constructor(private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.key = this.activatedRoute.snapshot.params['key'];

    this.daoCharacters = database.list('characters',
      r => r.orderByChild('chronicleId').equalTo(this.key));
    this.characters = this.daoCharacters.snapshotChanges().map(array => {
      return array.map(a => {
        return { key: a.key, value: a.payload.val()};
      });
    });
    this.current = {
      name: '',
      ownerId: this.angularFireAuth.auth.currentUser.uid,
      storytellerId: this.angularFireAuth.auth.currentUser.uid,
      chronicleId: this.key,
      isOpen: false
    };
  }

  public characterChange(key: string): void {
    console.log(key);
  }

  public save(): void {
    from(this.daoCharacters.push(this.current)).blocker(this.blocker).subscribe(r => console.log(r.key));
  }
}
