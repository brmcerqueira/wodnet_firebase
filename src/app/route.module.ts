import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SignInComponent} from './components/sign.in.component';
import {InComponent} from './components/in.component';
import {AuthenticationGuard} from './authentication.guard';
import {DiceBoardComponent} from './components/dice.board.component';
import {StartGameComponent} from './components/start.game.component';
import {ChronicleComponent} from './components/chronicle.component';
import {PlayerComponent} from './components/player.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'in', component: InComponent, canActivate: [AuthenticationGuard], children: [
    { path: '', component: StartGameComponent },
    { path: 'player/:key', component: PlayerComponent },
    { path: 'chronicle/:key', component: ChronicleComponent },
    { path: 'dice', component: DiceBoardComponent }
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
