import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouteModule} from './route.module';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HttpModule} from '@angular/http';
import {AuthenticationGuard} from './authentication.guard';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Blocker} from './blocker';
import {CommonModule} from '@angular/common';
import { MasterComponent } from './views/master/master.component';
import { InComponent } from './views/in/in.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { SingleSelectComponent } from './views/select/single-select.component';
import { CharacterComponent } from './views/character/character.component';
import { StartGameComponent } from './views/start-game/start-game.component';
import { PlayerComponent } from './views/player/player.component';
import { ChronicleComponent } from './views/chronicle/chronicle.component';
import { DiceBoardComponent } from './views/dice-board/dice-board.component';
import {DynamicFormGroupComponent} from './views/dynamic-form-group/dynamic-form-group.component';
import {FormGroupParsePipe} from './form.group.parse.pipe';
import {WrapperDirective} from './wrapper.directive';
import {CircleSpinnerComponent} from './views/spinner/circle-spinner.component';
import {SquareSpinnerComponent} from './views/spinner/square-spinner.component';
import {HealthComponent} from './views/health/health.component';
import { ComponentsModule } from './components/components.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MultiSelectComponent} from "./views/select/multi-select.component";
import {AudioConferenceService} from "./audio.conference.service";

export function translateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `${document.getElementsByTagName('base')[0].href}assets/i18n/`);
}

@NgModule({
  declarations: [
    MasterComponent,
    InComponent,
    SignInComponent,
    SingleSelectComponent,
    MultiSelectComponent,
    CircleSpinnerComponent,
    SquareSpinnerComponent,
    CharacterComponent,
    StartGameComponent,
    PlayerComponent,
    ChronicleComponent,
    DiceBoardComponent,
    DynamicFormGroupComponent,
    HealthComponent,
    FormGroupParsePipe,
    WrapperDirective
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    ComponentsModule
  ],
  providers: [
    Blocker,
    AuthenticationGuard,
    WrapperDirective,
    AudioConferenceService
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
