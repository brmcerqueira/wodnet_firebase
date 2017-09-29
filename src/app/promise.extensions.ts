import { Promise } from 'firebase/app';
import {Blocker} from './blocker';

declare module 'firebase/app' {
  interface Promise<T> {
    blocker(blocker: Blocker): this;
  }
}

Promise.prototype.blocker = function<T> (blocker: Blocker): Promise<T> {
  blocker.subject.next(true);
  return this.then(_ => blocker.subject.next(false))
    .catch(_ => blocker.subject.next(false));
};
