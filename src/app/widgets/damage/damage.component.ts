import {Component, forwardRef, Host, Input, OnInit, SkipSelf} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Damage} from "../../damage";
import {merge} from "rxjs";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DamageComponent),
    multi: true
  }]
})
export class DamageComponent implements ControlValueAccessor, OnInit {

  private superficial: number;
  private aggravated: number;
  private subscription: Subscription;
  public text: string;
  @Input() public max: string[];
  @Input() public maxPlus?: string;
  @Input() public isDisabled: boolean;
  private onChange: (damage: Damage) => void;
  private onTouched: () => void;


  constructor(@Host() @SkipSelf() private parent: FormGroupDirective) {
    this.superficial = 0;
    this.aggravated = 0;
    this.subscription = null;
    this.text = null;
  }

  public ngOnInit(): void {
    this.updateText();
    this.updateSubscribes();
  }

  private updateSubscribes(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    let observable: Observable<number> = null;

    this.max.forEach(c => {
      let control = this.parent.form.controls[c];
      observable = observable ? merge(observable, control.valueChanges) : control.valueChanges;
    });

    this.subscription = observable.subscribe(() => {
      if (this.totalDamage > this.total) {
        if (this.superficial > 0) {
          this.superficial--;
        }
        else {
          this.aggravated--;
        }
      }
      this.updateValue();
    });
  }

  private get total(): number {
    let result = this.maxPlus ? parseInt(this.maxPlus) : 0;
    this.max.forEach(c => result += this.parent.form.controls[c].value);
    return result;
  }

  private get totalDamage(): number {
    return this.aggravated + this.superficial;
  }

  private updateText(): void {
    this.text = '';
    for (let i = 0; i < this.aggravated; i++) {
      this.text += '<i class="p-1 fas fa-square"></i>';
    }
    for (let i = 0; i < this.superficial; i++) {
      this.text += '<i class="p-1 far fa-check-square"></i>';
    }
    for (let i = 0; i < this.total - this.totalDamage; i++) {
      this.text += '<i class="p-1 far fa-square"></i>';
    }
  }

  private updateValue() {
    this.updateText();

    if (this.onChange) {
      this.onChange({ superficial: this.superficial, aggravated: this.aggravated });
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  public lessAggravated(): void {
    if (this.aggravated > 0) {
      this.aggravated--;
      this.updateValue();
    }
  }

  public lessSuperficial(): void {
    if (this.superficial > 0) {
      this.superficial--;
      this.updateValue();
    }
  }

  public addSuperficial(): void {
    if (this.total > this.totalDamage) {
      this.superficial++;
      this.updateValue();
    }
  }

  public addAggravated(): void {
    if (this.total > this.totalDamage) {
      this.aggravated++;
      this.updateValue();
    }
  }

  public writeValue(value: Damage): void {
    this.superficial = value.superficial;
    this.aggravated = value.aggravated;
    this.updateText();
    this.updateSubscribes();
  }

  public registerOnChange(fn: (damage: Damage) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
