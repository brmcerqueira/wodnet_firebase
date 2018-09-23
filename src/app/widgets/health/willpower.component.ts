import {Component, forwardRef, Host, SkipSelf} from '@angular/core';
import {FormGroupDirective, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DamageComponent} from "./damage.component";
import {Observable} from "rxjs/Observable";
import { merge } from 'rxjs';

@Component({
  selector: 'willpower',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WillpowerComponent),
    multi: false
  }]
})
export class WillpowerComponent extends DamageComponent {

  constructor(@Host() @SkipSelf() private parent: FormGroupDirective) {
    super();
  }

  protected get valueChanges(): Observable<number> {
    return merge(this.parent.form.controls.composure.valueChanges, this.parent.form.controls.resolve.valueChanges);
  }

  protected get totalHealth(): number {
    return this.parent.form.controls.composure.value + this.parent.form.controls.resolve.value;
  }

  protected get superficialDamage(): number {
    return this.parent.form.controls.willpowerSuperficialDamage.value;
  }

  protected set superficialDamage(value: number) {
    this.parent.form.controls.willpowerSuperficialDamage.setValue(value);
  }

  protected get aggravatedDamage(): number {
    return this.parent.form.controls.willpowerAggravatedDamage.value;
  }

  protected set aggravatedDamage(value: number) {
    this.parent.form.controls.willpowerAggravatedDamage.setValue(value);
  }

  protected get totalDamage(): number {
    return this.superficialDamage + this.aggravatedDamage;
  }
}
