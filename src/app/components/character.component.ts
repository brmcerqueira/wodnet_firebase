import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'character',
  templateUrl: './character.component.html'
})
export class CharacterComponent implements OnInit {

  public formGroup: FormGroup;
  @Input() public chronicleId: string;
  @Output() public save: EventEmitter<Character>;

  constructor(private angularFireAuth: AngularFireAuth,
              private formBuilder: FormBuilder) {
    this.save = new EventEmitter();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      ownerId: this.angularFireAuth.auth.currentUser.uid,
      storytellerId: this.angularFireAuth.auth.currentUser.uid,
      chronicleId: this.chronicleId,
      isOpen: false
    });
  }

  public submit(): void {
    this.save.emit(this.formGroup.value);
  }
}
