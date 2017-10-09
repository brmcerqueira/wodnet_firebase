import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { GlobalBlockerComponent } from './global-blocker/global-blocker.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot(),
    RouterModule
  ],
  declarations: [
    NavbarComponent,
    GlobalBlockerComponent
  ],
  exports: [
    NavbarComponent,
    GlobalBlockerComponent
  ]
})
export class ComponentsModule { }
