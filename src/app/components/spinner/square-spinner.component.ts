import {SpinnerComponent} from "./spinner.component";
import {Component, forwardRef} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

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
  public fillMark = '&#x22a0;';
  public emptyMark = '&#x2b1a;';
}
