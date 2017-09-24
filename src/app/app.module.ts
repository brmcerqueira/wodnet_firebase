import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MasterComponent} from './components/master.component';
import {InComponent} from './components/in.component';
import {SignInComponent} from './components/sign.in.component';
import {RouteModule} from './route.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HttpModule} from '@angular/http';

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
    HttpModule,
    HttpClientModule,
    RouteModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
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
export class AppModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'pt']);
    translate.setDefaultLang('pt');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt/) ? browserLang : 'en').subscribe();
  }
}
