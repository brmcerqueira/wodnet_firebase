import {Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

export abstract class DamageComponent implements OnInit {

  public damage: string;
  @Input() public isDisabled: boolean;

  constructor() {
    this.damage = null;
  }

  public ngOnInit(): void {
    this.updateDamage();
    this.valueChanges.subscribe(() => {
      if (this.totalDamage > this.totalHealth) {
        if (this.superficialDamage > 0) {
          this.superficialDamage--;
        }
        else {
          this.aggravatedDamage--;
        }
      }
      this.updateDamage();
    });
  }

  protected abstract get valueChanges(): Observable<number>;

  protected abstract get totalHealth(): number;

  protected abstract get superficialDamage(): number;

  protected abstract set superficialDamage(value: number);

  protected abstract get aggravatedDamage(): number;

  protected abstract set aggravatedDamage(value: number);

  protected abstract get totalDamage(): number;

  private updateDamage(): void {
    this.damage = '';
    for (let i = 0; i < this.aggravatedDamage; i++) {
      this.damage += '<i class="p-1 fas fa-square"></i>';
    }
    for (let i = 0; i < this.superficialDamage; i++) {
      this.damage += '<i class="p-1 far fa-check-square"></i>';
    }
    for (let i = 0; i < this.totalHealth - this.totalDamage; i++) {
      this.damage += '<i class="p-1 far fa-square"></i>';
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
