import {SelectComponent} from './select.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Component, forwardRef} from '@angular/core';
import {SelectItem} from '../../select.item';

@Component({
  selector: 'multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
  }]
})

export class MultiSelectComponent extends SelectComponent implements ControlValueAccessor {

  public items: SelectItem[];
  private onChange: (ids: any[]) => void;
  private onTouched: () => void;

  constructor() {
    super();
    this.items = [];
  }

  public chooseItem(item: SelectItem): boolean {
    if (!this.items.some(i => i.id === item.id)) {
      this.items.push(item);
      this.updateData();
      return true;
    }
    return false;
  }

  private updateData() {
    if (this.onChange) {
      this.onChange(this.items.map(i => i.id));
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  public clear(index: number): void {
    this.items.splice(index, 1);
    this.updateData();
  }

  public writeValue(ids: any[]): void {
    this.text = null;
    if (ids) {
      this.source(ids, true).subscribe(data => {
        this.items = data;
      });
    }
    else {
      this.items = [];
    }
  }

  public registerOnChange(fn: (ids: any[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
