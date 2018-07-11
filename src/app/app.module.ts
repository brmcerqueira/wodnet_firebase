import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule, FirebaseOptionsToken} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouteModule} from './route.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AuthenticationGuard} from './authentication.guard';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Blocker} from './blocker';
import {CommonModule} from '@angular/common';
import { MasterComponent } from './views/master/master.component';
import { InComponent } from './views/in/in.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { CharacterComponent } from './views/character/character.component';
import { StartGameComponent } from './views/start-game/start-game.component';
import { PlayerComponent } from './views/player/player.component';
import { ChronicleComponent } from './views/chronicle/chronicle.component';
import { DiceBoardComponent } from './views/dice-board/dice-board.component';
import { WidgetsModule } from './widgets/widgets.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function translateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `${document.getElementsByTagName('base')[0].href}assets/i18n/`);
}

@NgModule({
  declarations: [
    MasterComponent,
    InComponent,
    SignInComponent,
    CharacterComponent,
    StartGameComponent,
    PlayerComponent,
    ChronicleComponent,
    DiceBoardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouteModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    WidgetsModule
  ],
  providers: [
    Blocker,
    AuthenticationGuard,
    { provide: FirebaseOptionsToken, useValue: environment.firebase }
  ],
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
