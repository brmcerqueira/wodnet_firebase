import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Router} from '@angular/router';
import {from} from '../observable.extensions';
import {AngularFireAuth} from "angularfire2/auth";

interface Chronicle {
  name: string;
  ownerId: string;
}

@Component({
  templateUrl: './start.game.component.html'
})
export class StartGameComponent {
  public formGroup: FormGroup;
  public chronicles: FirebaseListObservable<Chronicle[]>;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
    this.chronicles = database.list('chronicles').blocker(blocker);
  }

  public createChronicle(): void {
    const promise = this.chronicles.push(Object.assign({ ownerId: this.angularFireAuth.auth.currentUser.uid }, this.formGroup.value));
    from(promise).blocker(this.blocker).subscribe(() => this.router.navigate(['in/chronicle', promise.key ]));
  }
}
