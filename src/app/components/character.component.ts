import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {SelectItem} from '../select.item';
import {AngularFireDatabase} from 'angularfire2/database';
import {SelectSource} from '../select.source';

@Component({
  selector: 'character',
  templateUrl: './character.component.html'
})
export class CharacterComponent implements OnInit {

  public formGroup: Observable<FormGroup>;
  @Input() public character: Observable<Character>;
  @Output() public save: EventEmitter<Character>;

  constructor(private formBuilder: FormBuilder, private database: AngularFireDatabase) {
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

  public get users(): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return this.database.list('users', r => r.orderByChild('name').startAt(data)
        .endAt(`${data}\uf8ff`)).snapshotChanges().map(array => array.map(u => {
          return { id: u.payload.key, text: u.payload.val().name };
        }));
    };
  }

  public submit(character: Character): void {
    this.save.emit(character);
  }
}
