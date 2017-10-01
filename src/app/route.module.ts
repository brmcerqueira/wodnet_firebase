import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { InComponent } from './components/in/in.component';
import { AuthenticationGuard } from './authentication.guard';
import { StartGameComponent } from './components/start-game/start-game.component';
import { PlayerComponent } from './components/player/player.component';
import { ChronicleComponent } from './components/chronicle/chronicle.component';
import { DiceBoardComponent } from './components/dice-board/dice-board.component';


const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'in', component: InComponent, canActivate: [AuthenticationGuard], children: [
    { path: '', component: StartGameComponent },
    { path: 'player/:key', component: PlayerComponent },
    { path: 'chronicle/:key', component: ChronicleComponent },
    { path: 'dice/player/:key', data: { isStoryteller: false }, component: DiceBoardComponent },
    { path: 'dice/storyteller/:key', data: { isStoryteller: true }, component: DiceBoardComponent }
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
