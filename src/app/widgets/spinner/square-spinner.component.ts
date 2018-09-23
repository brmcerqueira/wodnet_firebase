import {SpinnerComponent} from "./spinner.component";
import {Component, forwardRef, Host, SkipSelf} from "@angular/core";
import {FormGroupDirective, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'square-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SquareSpinnerComponent),
    multi: true
  }]
})
export class SquareSpinnerComponent extends SpinnerComponent {
  public fillMark = 'p-1 far fa-check-square';
  public emptyMark = 'p-1 far fa-square';

  constructor(@Host() @SkipSelf() parent: FormGroupDirective) {
    super(parent);
  }
}
