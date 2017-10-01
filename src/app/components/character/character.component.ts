import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {SelectItem} from '../../select.item';
import {AngularFireDatabase} from 'angularfire2/database';
import {SelectSource} from '../../select.source';

@Component({
  selector: 'character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  public attributeMin: number;
  public max: number;
  public formGroup: Observable<FormGroup>;
  @Input() public canChangePlayer: boolean;
  @Input() public character: Observable<Character>;
  @Output() public save: EventEmitter<Character>;

  constructor(private formBuilder: FormBuilder, private database: AngularFireDatabase) {
    this.save = new EventEmitter();
    this.attributeMin = 1;
    this.max = 5;
  }

  ngOnInit(): void {
    this.formGroup = this.character.map(c => {
      return this.formBuilder.group({
        name: [c.name, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        ownerId: c.ownerId,
        storytellerId: c.storytellerId,
        chronicleId: c.chronicleId,
        isOpen: c.isOpen,
        strength: c.strength,
        dexterity: c.dexterity,
        stamina: c.stamina,
        charisma: c.charisma,
        manipulation: c.manipulation,
        appearance: c.appearance,
        perception: c.perception,
        intelligence: c.intelligence,
        wits: c.wits,
        physical: {
          athletics: c.physical.athletics,
          brawl: c.physical.brawl,
          crafts: c.physical.crafts,
          dodge: c.physical.dodge,
          drive: c.physical.drive,
          melee: c.physical.melee,
          security: c.physical.security,
          stealth: c.physical.stealth,
          survival: c.physical.survival
        },
        social: {
          animalKen: c.social.animalKen,
          empathy: c.social.empathy,
          etiquette: c.social.etiquette,
          intimidation: c.social.intimidation,
          leadership: c.social.leadership,
          performance: c.social.performance,
          persuasion: c.social.persuasion,
          streetwise: c.social.streetwise,
          subterfuge: c.social.subterfuge
        },
        mental: {
          academics: c.mental.academics,
          awareness: c.mental.awareness,
          firearms: c.mental.firearms,
          investigation: c.mental.investigation,
          linguistics: c.mental.linguistics,
          medicine: c.mental.medicine,
          occult: c.mental.occult,
          science: c.mental.science,
          technology: c.mental.technology
        }
      });
    });
  }

  public get users(): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return this.database.list('users', r => byKey
        ? r.orderByKey().equalTo(data)
        : r.orderByChild('name').startAt(data).endAt(`${data}\uf8ff`))
        .snapshotChanges().map(array => array.map(u => {
          return { id: u.payload.key, text: u.payload.val().name };
        }));
    };
  }

  public submit(character: Character): void {
    this.save.emit(character);
  }
}
