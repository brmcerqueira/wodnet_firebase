import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SignInComponent} from './components/sign.in.component';
import {InComponent} from './components/in.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'in', component: InComponent, children: [

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
