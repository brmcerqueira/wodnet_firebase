import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  templateUrl: './in.component.html',
  styleUrls: ['./in.component.scss']
})
export class InComponent {
  public chronicleKey: string;
  public characterKey: string;

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
