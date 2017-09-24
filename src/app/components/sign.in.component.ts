import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from '@angular/router';

@Component({
  templateUrl: './sign.in.component.html'
})
export class SignInComponent {
  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
  }

  public signInWithGoogle(): void {
    this.angularFireAuth.auth.signInWithPopup(new GoogleAuthProvider()).then(() => {
      this.router.navigate(['in']);
    });
  }
}
