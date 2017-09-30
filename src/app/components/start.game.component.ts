import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Router} from '@angular/router';
import {fromThenable} from '../observable.extensions';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';

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
    this.chronicles = this.daoChronicles.snapshotChanges().map(array => {
      return array.map(a => a.payload.val());
    });
  }

  public createChronicle(): void {
    fromThenable(this.daoChronicles.push(Object.assign({ ownerId: this.angularFireAuth.auth.currentUser.uid }, this.formGroup.value)))
      .blocker(this.blocker).subscribe(r => this.router.navigate(['in/chronicle', r.key]));
  }
}
