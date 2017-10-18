import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { InComponent } from './views/in/in.component';
import { AuthenticationGuard } from './authentication.guard';
import { StartGameComponent } from './views/start-game/start-game.component';
import { PlayerComponent } from './views/player/player.component';
import { ChronicleComponent } from './views/chronicle/chronicle.component';
import { DiceBoardComponent } from './views/dice-board/dice-board.component';


const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'in', component: InComponent, canActivate: [AuthenticationGuard], children: [
    { path: '', component: StartGameComponent },
    { path: 'player/:chronicleKey/:characterKey', component: PlayerComponent },
    { path: 'chronicle/:chronicleKey', component: ChronicleComponent },
    { path: 'dice/player/:chronicleKey/:characterKey', data: { isStoryteller: false }, component: DiceBoardComponent },
    { path: 'dice/storyteller/:chronicleKey', data: { isStoryteller: true }, component: DiceBoardComponent }
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
