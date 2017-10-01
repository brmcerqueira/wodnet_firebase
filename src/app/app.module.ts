import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {RouteModule} from './route.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HttpModule} from '@angular/http';
import {EnTranslate} from '../environments/i18n/en.translate';
import {PtTranslate} from '../environments/i18n/pt.translate';
import {AuthenticationGuard} from './authentication.guard';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Blocker} from './blocker';
import {CommonModule} from '@angular/common';
import { MasterComponent } from './components/master/master.component';
import { InComponent } from './components/in/in.component';
import { GlobalBlockerComponent } from './components/global-blocker/global-blocker.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SingleSelectComponent } from './components/single-select/single-select.component';
import { CharacterComponent } from './components/character/character.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { PlayerComponent } from './components/player/player.component';
import { ChronicleComponent } from './components/chronicle/chronicle.component';
import { DiceBoardComponent } from './components/dice-board/dice-board.component';
import {SpinnerComponent} from "./components/spinner/spinner.component";

@NgModule({
  declarations: [
    MasterComponent,
    InComponent,
    GlobalBlockerComponent,
    SignInComponent,
    SingleSelectComponent,
    SpinnerComponent,
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
    HttpModule,
    HttpClientModule,
    RouteModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    TranslateModule.forRoot(),
    NgbModule.forRoot()
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
