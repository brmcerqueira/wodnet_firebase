import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from '@angular/router';

@Component({
  templateUrl: './sign.in.component.html'
})
export class SignInComponent {

  public isAnonymous: boolean;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
    this.isAnonymous = false;
    this.angularFireAuth.authState.subscribe(u => {
      if (u && !u.isAnonymous) {
        this.goIn();
      } else {
        this.isAnonymous = true;
      }
    });
  }

  public signInWithGoogle(): void {
    this.angularFireAuth.auth.signInWithPopup(new GoogleAuthProvider()).then(() => {
      this.goIn();
    });
  }

  private goIn() {
    this.router.navigate(['in']);
  }
}
