import {Component, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectItem} from '../../select.item';
import {SelectComponent} from './select.component';

@Component({
  selector: 'single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
  }]
})
export class SingleSelectComponent extends SelectComponent implements ControlValueAccessor {

  public item: SelectItem;
  private onChange: (id: any) => void;
  private onTouched: () => void;

  constructor() {
    super();
    this.item = null;
  }

  public chooseItem(item: SelectItem): boolean {
    this.item = item;
    this.updateData();
    return true;
  }

  private updateData() {
    if (this.onChange) {
      this.onChange(this.item ? this.item.id : null);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  public clear(): void {
    this.item = null;
    this.selected.emit(this.item);
    this.updateData();
  }

  public writeValue(id: any): void {
    this.text = null;
    if (id) {
      this.source(id, true).subscribe(data => {
        if (data.length === 1) {
          this.item = data[0];
        }
      });
    } else {
      this.item = null;
    }
  }

  public registerOnChange(fn: (id: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
