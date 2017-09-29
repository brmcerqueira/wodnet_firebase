import { Observable } from 'rxjs/Observable';
import {Blocker} from './blocker';
import {Thenable} from 'firebase/app';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    blocker(value: Blocker): this;
  }
}

export function from<T>(thenable: Thenable<T>): Observable<T> {
  return Observable.create(s => {
    thenable.then(i => s.next(i), i => s.error(i));
  });
}

Observable.prototype.blocker = function <T>(value: Blocker): Observable<T> {
  value.subject.next(true);
  return (<Observable<T>>this).map(item => {
    value.subject.next(false);
    return item;
  });
};
