import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SignInComponent} from './components/sign.in.component';
import {InComponent} from './components/in.component';
import {AuthenticationGuard} from './authentication.guard';
import {DiceBoardComponent} from './components/dice.board.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'in', component: InComponent, canActivate: [AuthenticationGuard], children: [
    { path: '', component: DiceBoardComponent }
  ]},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RouteModule {}
