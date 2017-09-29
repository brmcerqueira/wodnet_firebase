import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {from} from '../observable.extensions';

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
  public characters: FirebaseListObservable<Character[]>;
  public current: Character;

  constructor(private activatedRoute: ActivatedRoute,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.key = this.activatedRoute.snapshot.params['key'];
    this.characters = database.list('characters', {
      query: {
        orderByChild: 'chronicleId',
        equalTo: this.key
      }
    }).blocker(blocker);
    this.current = {
      name: '',
      ownerId: this.angularFireAuth.auth.currentUser.uid,
      storytellerId: this.angularFireAuth.auth.currentUser.uid,
      chronicleId: this.key,
      isOpen: false
    };
  }

  public characterChange(key: string): void {

  }

  public save(): void {
    const promise = this.characters.push(this.current);
    from(promise).blocker(this.blocker).subscribe(() => console.log(promise.key));
  }
}
