import {PipeTransform, Pipe} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Pipe({ name: 'formGroupParse', pure: false })
export class FormGroupParsePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  public transform(form: FormGroup): { key: string, label: string }[] {
    return Object.keys(form.controls).map(k => {
      return { key: k, label: this.translate.instant(k) };
    }).sort((l, r) => l.label > r.label ? 1 : (r.label > l.label ? -1 : 0));
  }
}
