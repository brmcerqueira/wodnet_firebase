import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Blocker} from "../../blocker";

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
    this.blocker.subject.next(true);
    this.angularFireAuth.auth.signInWithPopup(new GoogleAuthProvider()).then(() => {
      this.daoUsers.update(this.angularFireAuth.auth.currentUser.uid, {
        name: this.angularFireAuth.auth.currentUser.displayName.toLowerCase(),
        photo: this.angularFireAuth.auth.currentUser.photoURL
      }).then(() => {
        this.blocker.subject.next(false);
        this.goIn();
      });
    });
  }

  private goIn() {
    this.router.navigate(['in']);
  }
}
