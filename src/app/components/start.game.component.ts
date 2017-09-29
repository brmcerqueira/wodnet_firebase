import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Blocker} from '../blocker';
import {Router} from '@angular/router';

@Component({
  templateUrl: './start.game.component.html'
})
export class StartGameComponent {
  public formGroup: FormGroup;
  public chronicles: FirebaseListObservable<any[]>;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private database: AngularFireDatabase,
              private blocker: Blocker) {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
    this.chronicles = database.list('chronicles');
  }

  public createChronicle(): void {
    this.blocker.with(this.chronicles.push(this.formGroup.value))
      .then(() => this.router.navigate(['in/chronicle']));
  }
}
