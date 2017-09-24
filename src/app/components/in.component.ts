import {Component} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {Router} from "@angular/router";

@Component({
  templateUrl: './in.component.html'
})
export class InComponent {
  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
  }

  public signOut(): void {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['']));
  }
}
