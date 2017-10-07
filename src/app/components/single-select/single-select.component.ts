import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {SelectItem} from '../../select.item';
import {SelectSource} from "../../select.source";

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
export class SingleSelectComponent implements ControlValueAccessor {

  @Input() public source: SelectSource;
  public text: string;
  public item: SelectItem;
  @Output() public selected: EventEmitter<NgbTypeaheadSelectItemEvent>;
  @Input() public disabled: boolean;
  private onChange: (id: any) => void;
  private onTouched: () => void;

  constructor() {
    this.text = null;
    this.item = null;
    this.selected = new EventEmitter();
    this.disabled = false;
  }

  public get typeaheadSource(): (text: Observable<string>) => Observable<SelectItem[]> {
    return (text: Observable<string>): Observable<SelectItem[]> => {
      return text.debounceTime(200).distinctUntilChanged().flatMap(val => {
        return this.source(val.toLowerCase(), false);
      });
    };
  }

  public selectItem(event: NgbTypeaheadSelectItemEvent): void {
    this.text = null;
    this.item = event.item;
    this.dataUpdate();
    this.selected.emit(event);
  }

  private dataUpdate() {
    if (this.onChange) {
      this.onChange(this.item ? this.item.id : null);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  public inputFormatter(value: SelectItem): string {
    return null;
  }

  public resultFormatter(value: SelectItem): string {
    return value.text;
  }

  public clear(): void {
    this.item = null;
    this.dataUpdate();
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
