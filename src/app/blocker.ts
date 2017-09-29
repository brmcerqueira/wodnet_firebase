import {Subject} from 'rxjs/Subject';

export class Blocker {
  public subject: Subject<boolean>;
  constructor() {
    this.subject = new Subject<boolean>();
  }
}
