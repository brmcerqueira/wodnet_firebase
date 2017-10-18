import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private chronicleKey: string;
  private characterKey: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private angularFireAuth: AngularFireAuth) {
    activatedRoute.url.subscribe(() => {
      const params = activatedRoute.snapshot.firstChild.params;
      this.chronicleKey = params.chronicleKey;
      this.characterKey = params.characterKey;
    });
  }

  public get diceBoard(): string[] {
    return this.chronicleKey ? (this.characterKey
      ? ['/in/dice/player', this.chronicleKey, this.characterKey]
      : ['/in/dice/storyteller', this.chronicleKey]) : null;
  }

  public get character(): string[] {
    return this.chronicleKey ? (this.characterKey
      ? ['/in/player', this.chronicleKey, this.characterKey]
      : ['/in/chronicle', this.chronicleKey]) : null;
  }

  public signOut(): void {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['']));
  }
}
