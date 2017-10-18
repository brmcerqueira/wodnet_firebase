import {EventEmitter, Input, Output} from '@angular/core';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import {SelectSource} from '../../select.source';
import {SelectItem} from '../../select.item';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';

export abstract class SelectComponent {

  @Input() public source: SelectSource;
  public text: string;
  @Output() public selected: EventEmitter<SelectItem>;
  @Input() public isDisabled: boolean;

  constructor() {
    this.text = null;
    this.selected = new EventEmitter();
    this.isDisabled = false;
  }

  public get typeaheadSource(): (text: Observable<string>) => Observable<SelectItem[]> {
    return (text: Observable<string>): Observable<SelectItem[]> => {
      return text.debounceTime(200).distinctUntilChanged().flatMap(val => {
        return this.source(val.toLowerCase(), false);
      });
    };
  }

  public selectItem(event: NgbTypeaheadSelectItemEvent): void {
    if (this.chooseItem(event.item)) {
      this.text = null;
      this.selected.emit(event.item);
    }
  }

  abstract chooseItem(item: SelectItem): boolean;

  public inputFormatter(item: SelectItem): string {
    return null;
  }

  public resultFormatter(item: SelectItem): string {
    return item.text;
  }
}
