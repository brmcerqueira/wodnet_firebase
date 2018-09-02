import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Blocker} from "../../blocker";
import {fromPromise} from "../../observable.extensions";
import {flatMap} from "rxjs/operators";

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  public isAnonymous: boolean;
  private daoUsers: AngularFireList<any>;

  constructor(private router: Router,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.isAnonymous = false;
    this.angularFireAuth.authState.subscribe(u => {
      if (u && !u.isAnonymous) {
        this.goIn();
      } else {
        this.isAnonymous = true;
      }
    });
    this.daoUsers = database.list('users');
  }

  public signInWithGoogle(): void {
    fromPromise(this.angularFireAuth.auth.signInWithPopup(new GoogleAuthProvider()))
      .pipe(flatMap(u => {
        return fromPromise(this.daoUsers.update(u.user.uid, {
          name: u.user.displayName.toLowerCase(),
          photo: u.user.photoURL
        }))
      }), this.blocker.toPipe()).subscribe(() => this.goIn());
  }

  private goIn() {
    this.router.navigate(['in']);
  }
}
