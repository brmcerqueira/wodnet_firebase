import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MasterComponent} from './components/master.component';
import {InComponent} from './components/in.component';
import {SignInComponent} from './components/sign.in.component';
import {RouteModule} from "./route.module";

export function translateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `${document.getElementsByTagName('base')[0].href}assets/i18n/`);
}

@NgModule({
  declarations: [
    MasterComponent,
    InComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    RouteModule,
    AngularFireModule.initializeApp(environment.firebase),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [MasterComponent]
})
export class AppModule { }
