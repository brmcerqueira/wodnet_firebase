import {Component, forwardRef, Host, Input, OnInit, SkipSelf} from '@angular/core';
import {FormGroupDirective, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HealthComponent),
    multi: true
  }]
})
export class HealthComponent implements OnInit {

  public health: string;
  public damage: string;
  @Input() public disabled: boolean;

  constructor(@Host() @SkipSelf() private parent: FormGroupDirective) {
    this.health = null;
    this.damage = null;
  }

  public ngOnInit(): void {
    this.updateHealth();
    this.updateDamage();
    this.parent.form.controls.stamina.valueChanges.subscribe(() => {
      if (this.totalDamage > this.totalHealth) {
        if (this.superficialDamage > 0) {
          this.superficialDamage--;
        }
        else {
          this.aggravatedDamage--;
        }
      }
      this.updateHealth();
      this.updateDamage();
    });
  }

  private get totalHealth(): number {
    return this.parent.form.controls.stamina.value + 5;
  }

  private get superficialDamage(): number {
    return this.parent.form.controls.superficialDamage.value;
  }

  private set superficialDamage(value: number) {
    this.parent.form.controls.superficialDamage.setValue(value);
  }

  private get aggravatedDamage(): number {
    return this.parent.form.controls.aggravatedDamage.value;
  }

  private set aggravatedDamage(value: number) {
    this.parent.form.controls.aggravatedDamage.setValue(value);
  }

  private get totalDamage(): number {
    return this.superficialDamage + this.aggravatedDamage;
  }

  private updateHealth(): void {
    this.health = '';
    for (let i = 0; i < this.totalHealth; i++) {
      this.health += '&#x25cf;';
    }
    for (let i = 0; i < 10 - this.totalHealth; i++) {
      this.health += '&#x25cb;';
    }
  }

  private updateDamage(): void {
    this.damage = '';
    for (let i = 0; i < this.aggravatedDamage; i++) {
      this.damage += '&#x26dd;';
    }
    for (let i = 0; i < this.superficialDamage; i++) {
      this.damage += '&#x26de;';
    }
    for (let i = 0; i < this.totalHealth - this.totalDamage; i++) {
      this.damage += '&#x2b1a;';
    }
  }

  public lessAggravated(): void {
    if (this.aggravatedDamage > 0) {
      this.aggravatedDamage--;
      this.updateDamage();
    }
  }

  public lessSuperficial(): void {
    if (this.superficialDamage > 0) {
      this.superficialDamage--;
      this.updateDamage();
    }
  }

  public addSuperficial(): void {
    if (this.totalHealth > this.totalDamage) {
      this.superficialDamage++;
      this.updateDamage();
    }
  }

  public addAggravated(): void {
    if (this.totalHealth > this.totalDamage) {
      this.aggravatedDamage++;
      this.updateDamage();
    }
  }
}
