import { Observable } from 'rxjs/Observable';
import {Blocker} from './blocker';
import {OperatorFunction} from "rxjs/interfaces";
import {MapOperator} from "rxjs/internal/operators/map";

export function fromPromise<U>(promise: PromiseLike<U>): Observable<U> {
  return Observable.create(s => {
    promise.then(i => s.next(i), e => s.error(e));
  });
}

export function blocker<T>(value: Blocker, thisArg?: any): OperatorFunction<T, T> {
  return function (source: Observable<T>): Observable<T> {
    value.subject.next(true);
    return source.lift<T>(new MapOperator(item => {
      value.subject.next(false);
      return item;
    }, thisArg));
  };
}
