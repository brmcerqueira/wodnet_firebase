import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.angularFireAuth.authState.map(u => {
      if (u && !u.isAnonymous) {
        return true;
      }
      this.router.navigate(['']);
      return false;
    });
  }
}
