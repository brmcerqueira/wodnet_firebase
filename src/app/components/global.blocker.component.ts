import { Component } from '@angular/core';
import {Blocker} from '../blocker';

@Component({
  selector: 'global-blocker',
  templateUrl: './global.blocker.component.html',
})
export class GlobalBlockerComponent {
  constructor(public blocker: Blocker) {

  }
}
