import {Component} from '@angular/core';
import {Blocker} from '../../blocker';
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from '../../observable.extensions';

@Component({
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  public characterObservable: Observable<Character>;
  private daoCharacter: AngularFireObject<any>;

  constructor(private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private blocker: Blocker) {
    this.daoCharacter = database.object(`characters/${this.activatedRoute.snapshot.params['key']}`);
    this.characterObservable = this.daoCharacter.valueChanges();
  }

  public save(character: Character): void {
    fromPromise(this.daoCharacter.update(character)).blocker(this.blocker).subscribe();
  }
}
