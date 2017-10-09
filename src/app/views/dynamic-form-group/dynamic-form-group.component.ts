import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {SelectSource} from '../../select.source';
import {Observable} from 'rxjs/Observable';
import {SelectItem} from '../../select.item';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss'],
})
export class DynamicFormGroupComponent {

  @Input() public source: SelectSource;
  @Input() public formGroup: FormGroup;
  @Input() public createControl: () => AbstractControl;
  @Input() public disabled: boolean;
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

  public get typeaheadSource(): (text: Observable<string>) => Observable<SelectItem[]> {
    return (text: Observable<string>): Observable<SelectItem[]> => {
      return text.debounceTime(200).distinctUntilChanged().flatMap(val => {
        return this.source(val.toLowerCase(), false);
      });
    };
  }

  public selectItem(event: NgbTypeaheadSelectItemEvent): void {
    const item: SelectItem = event.item;

    if (!this.formGroup.contains(item.id)) {
      this.formGroup.addControl(item.id, this.createControl());
    }
  }

  public remove(key: string): void {
    this.formGroup.removeControl(key);
  }

  public inputFormatter(item: SelectItem): string {
    return null;
  }

  public resultFormatter(item: SelectItem): string {
    return item.text;
  }
}
