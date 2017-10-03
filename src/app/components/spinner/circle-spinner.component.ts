import {SpinnerComponent} from './spinner.component';
import {Component, forwardRef, Host, SkipSelf} from '@angular/core';
import {FormGroupDirective, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'circle-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CircleSpinnerComponent),
    multi: true
  }]
})
export class CircleSpinnerComponent extends SpinnerComponent {
  public fillMark = '&#x25cf;';
  public emptyMark = '&#x25cb;';

  constructor(@Host() @SkipSelf() parent: FormGroupDirective) {
    super(parent);
  }
}
