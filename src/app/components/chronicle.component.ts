import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Blocker} from '../blocker';
import '../promise.extensions';

@Component({
  templateUrl: './chronicle.component.html'
})
export class ChronicleComponent {
  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private database: AngularFireDatabase,
              private blocker: Blocker) {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
  }

  public createChronicle(): void {
    const chronicles = this.database.object('chronicles');
    chronicles.set(this.formGroup.value).blocker(this.blocker);
  }
}
