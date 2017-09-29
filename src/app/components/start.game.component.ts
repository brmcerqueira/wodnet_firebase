import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase, AngularFireList, SnapshotAction} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Router} from '@angular/router';
import {from} from '../observable.extensions';
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";

interface Chronicle {
  name: string;
  ownerId: string;
}

@Component({
  templateUrl: './start.game.component.html'
})
export class StartGameComponent {
  public formGroup: FormGroup;
  public chronicles: Observable<Chronicle[]>;
  private daoChronicles: AngularFireList<any>;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private database: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private blocker: Blocker) {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
    this.daoChronicles = database.list('chronicles');
    this.chronicles = this.daoChronicles.snapshotChanges().blocker(blocker).map(array => {
      return array.map(a => a.payload.val());
    });
  }

  public createChronicle(): void {
    const promise = this.daoChronicles.push(Object.assign({ ownerId: this.angularFireAuth.auth.currentUser.uid }, this.formGroup.value));
    from(promise).blocker(this.blocker).subscribe(() => this.router.navigate(['in/chronicle', promise.key ]));
  }
}
