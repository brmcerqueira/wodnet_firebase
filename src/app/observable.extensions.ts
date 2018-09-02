import { Observable } from 'rxjs/Observable';

export function fromPromise<T>(promise: PromiseLike<T>): Observable<T> {
  return Observable.create(s => {
    promise.then(i => s.next(i), e => s.error(e));
  });
}
