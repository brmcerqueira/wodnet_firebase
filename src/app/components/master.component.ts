import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'master',
  templateUrl: './master.component.html'
})
export class MasterComponent {
  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
    this.angularFireAuth.authState.subscribe(u => {
      if (!u.isAnonymous) {
        this.router.navigate(['in']);
      }
    });
  }
}
