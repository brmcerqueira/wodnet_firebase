import {Component, forwardRef, Host, SkipSelf} from '@angular/core';
import {FormGroupDirective, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DamageComponent} from "./damage.component";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'health',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HealthComponent),
    multi: false
  }]
})
export class HealthComponent extends DamageComponent {

  constructor(@Host() @SkipSelf() private parent: FormGroupDirective) {
    super();
  }

  protected get valueChanges(): Observable<number> {
    return this.parent.form.controls.stamina.valueChanges;
  }

  protected get totalHealth(): number {
    return this.parent.form.controls.stamina.value + 3;
  }

  protected get superficialDamage(): number {
    return this.parent.form.controls.healthSuperficialDamage.value;
  }

  protected set superficialDamage(value: number) {
    this.parent.form.controls.healthSuperficialDamage.setValue(value);
  }

  protected get aggravatedDamage(): number {
    return this.parent.form.controls.healthAggravatedDamage.value;
  }

  protected set aggravatedDamage(value: number) {
    this.parent.form.controls.healthAggravatedDamage.setValue(value);
  }

  protected get totalDamage(): number {
    return this.superficialDamage + this.aggravatedDamage;
  }
}
