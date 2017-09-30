import { Observable } from 'rxjs/Observable';
import {Blocker} from './blocker';
import {Thenable} from 'firebase/app';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    blocker(value: Blocker): this;
  }
}

export function fromThenable<U, T extends Thenable<U>>(thenable: T): Observable<T> {
  return Observable.create(s => {
    thenable.then(_ => s.next(thenable), e => s.error(e));
  });
}

export function fromPromise<U, T extends Promise<U>>(promise: T): Observable<T> {
  return Observable.create(s => {
    promise.then(_ => s.next(promise), e => s.error(e));
  });
}

Observable.prototype.blocker = function <T>(value: Blocker): Observable<T> {
  value.subject.next(true);
  return (<Observable<T>>this).map(item => {
    value.subject.next(false);
    return item;
  });
};
