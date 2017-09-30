import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'character',
  templateUrl: './character.component.html'
})
export class CharacterComponent implements OnInit {

  public formGroup: Observable<FormGroup>;
  @Input() public character: Observable<Character>;
  @Output() public save: EventEmitter<Character>;

  constructor(private formBuilder: FormBuilder) {
    this.save = new EventEmitter();
  }

  ngOnInit(): void {
    this.formGroup = this.character.map(c => {
      return this.formBuilder.group({
        name: [c.name, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        ownerId: c.ownerId,
        storytellerId: c.storytellerId,
        chronicleId: c.chronicleId,
        isOpen: c.isOpen
      });
    });
  }

  public submit(character: Character): void {
    this.save.emit(character);
  }
}
