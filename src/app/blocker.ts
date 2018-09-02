import {Observable} from "rxjs/Observable";
import {MapOperator} from "rxjs/internal/operators/map";
import {OperatorFunction} from "rxjs/interfaces";

export class Blocker {
  public value: boolean;

  constructor() {
    this.value = false;
  }

  public toPipe<T>(thisArg?: any): OperatorFunction<T, T> {
    return (source: Observable<T>): Observable<T> => {
      this.value = true;
      return source.lift<T>(new MapOperator(item => {
        this.value = false;
        return item;
      }, thisArg));
    };
  }
}
