import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(map(u => {
      if (u && !u.isAnonymous) {
        return true;
      }
      this.router.navigate(['']);
      return false;
    }));
  }
}
