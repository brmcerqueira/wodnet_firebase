import {Observable} from 'rxjs/Observable';
import {SelectItem} from './select.item';

export type SelectSource = (data: any, byKey: boolean) => Observable<SelectItem[]>;
