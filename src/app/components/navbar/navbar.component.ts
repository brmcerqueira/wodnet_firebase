import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {

  }

  public signOut(): void {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['']));
  }
}
