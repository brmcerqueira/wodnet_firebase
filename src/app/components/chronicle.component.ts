import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Observable} from 'rxjs/Observable';
import {from} from '../observable.extensions';

interface SelectItem<TKey, TValue> {
  key: TKey;
  value: TValue;
}

@Component({
  templateUrl: './chronicle.component.html'
})
export class ChronicleComponent {

  public chronicleId: string;
  public characters: Observable<SelectItem<string, Character>[]>;
  private daoCharacters: AngularFireList<any>;

  constructor(private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private blocker: Blocker) {
    this.chronicleId = this.activatedRoute.snapshot.params['key'];

    this.daoCharacters = database.list('characters',
      r => r.orderByChild('chronicleId').equalTo(this.chronicleId));
    this.characters = this.daoCharacters.snapshotChanges().map(array => {
      return array.map(a => {
        return { key: a.key, value: a.payload.val()};
      });
    });
  }

  public characterChange(key: string): void {
    console.log(key);
  }

  public save(character: Character): void {
    from(this.daoCharacters.push(character)).blocker(this.blocker).subscribe(r => console.log(r.key));
  }
}
