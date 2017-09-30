import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {MasterComponent} from './components/master.component';
import {InComponent} from './components/in.component';
import {SignInComponent} from './components/sign.in.component';
import {RouteModule} from './route.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HttpModule} from '@angular/http';
import {EnTranslate} from '../environments/i18n/en.translate';
import {PtTranslate} from '../environments/i18n/pt.translate';
import {AuthenticationGuard} from './authentication.guard';
import {DiceBoardComponent} from './components/dice.board.component';
import {StartGameComponent} from './components/start.game.component';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import {ReactiveFormsModule} from '@angular/forms';
import {Blocker} from './blocker';
import {GlobalBlockerComponent} from './components/global.blocker.component';
import {ChronicleComponent} from './components/chronicle.component';
import {CharacterComponent} from "./components/character.component";

@NgModule({
  declarations: [
    MasterComponent,
    InComponent,
    GlobalBlockerComponent,
    SignInComponent,
    CharacterComponent,
    StartGameComponent,
    ChronicleComponent,
    DiceBoardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouteModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    TranslateModule.forRoot()
  ],
  providers: [
    Blocker,
    AuthenticationGuard
  ],
  bootstrap: [MasterComponent]
})
export class AppModule {
  constructor(private translate: TranslateService) {
    translate.setTranslation('en', EnTranslate);
    translate.setTranslation('pt', PtTranslate);
    translate.setDefaultLang('pt');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt/) ? browserLang : 'en').subscribe();
  }
}
