import {Subject} from 'rxjs/Subject';
import {Thenable} from 'firebase/app';

export class Blocker {
  public subject: Subject<boolean>;
  constructor() {
    this.subject = new Subject<boolean>();
  }

  public with<T>(thenable: Thenable<T>): Thenable<T> {
    this.subject.next(true);
    return thenable.then(_ => this.subject.next(false))
      .catch(_ => this.subject.next(false));
  }
}
