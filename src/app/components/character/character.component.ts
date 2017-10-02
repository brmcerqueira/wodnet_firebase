import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {SelectItem} from '../../select.item';
import {AngularFireDatabase} from 'angularfire2/database';
import {SelectSource} from '../../select.source';
import {Character} from '../../character';
import {Clan} from '../../clan';
import {TranslateService} from '@ngx-translate/core';
import {Virtue} from '../../virtue';
import {Vice} from '../../vice';

@Component({
  selector: 'character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  public attributeMin: number;
  public skillMin: number;
  public max: number;
  public formGroup: Observable<FormGroup>;
  @Input() public canChangePlayer: boolean;
  @Input() public character: Observable<Character>;
  @Output() public save: EventEmitter<Character>;

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              private database: AngularFireDatabase) {
    this.save = new EventEmitter();
    this.attributeMin = 1;
    this.skillMin = 0;
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
        virtue: c.virtue,
        vice: c.vice,
        clan: c.clan,
        strength: c.strength,
        dexterity: c.dexterity,
        stamina: c.stamina,
        charisma: c.charisma,
        manipulation: c.manipulation,
        appearance: c.appearance,
        perception: c.perception,
        intelligence: c.intelligence,
        wits: c.wits,
        physical: this.formBuilder.group({
          athletics: c.physical.athletics,
          brawl: c.physical.brawl,
          crafts: c.physical.crafts,
          dodge: c.physical.dodge,
          drive: c.physical.drive,
          melee: c.physical.melee,
          security: c.physical.security,
          stealth: c.physical.stealth,
          survival: c.physical.survival
        }),
        social: this.formBuilder.group({
          animalKen: c.social.animalKen,
          empathy: c.social.empathy,
          etiquette: c.social.etiquette,
          intimidation: c.social.intimidation,
          leadership: c.social.leadership,
          performance: c.social.performance,
          persuasion: c.social.persuasion,
          streetwise: c.social.streetwise,
          subterfuge: c.social.subterfuge
        }),
        mental: this.formBuilder.group({
          academics: c.mental.academics,
          awareness: c.mental.awareness,
          firearms: c.mental.firearms,
          investigation: c.mental.investigation,
          linguistics: c.mental.linguistics,
          medicine: c.mental.medicine,
          occult: c.mental.occult,
          science: c.mental.science,
          technology: c.mental.technology
        }),
        disciplines: c.disciplines
      });
    });
  }


  private enumSelectSource(enumObject: any): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return Observable.create(s => {
        s.next(byKey ? [{ id: data, text: this.translate.instant(enumObject[data]) }]
          : Object.keys(enumObject).filter(key => {
            const item = enumObject[key];
            if (!isNaN(Number(item))) return false;
            return (<string>this.translate.instant(item)).toLowerCase().indexOf(data) > -1;
          }).map(key => {
            return { id: Number(key), text: this.translate.instant(enumObject[key]) };
          }));
      });
    };
  }

  public get virtues(): SelectSource {
    return this.enumSelectSource(Virtue);
  }

  public get vices(): SelectSource {
    return this.enumSelectSource(Vice);
  }

  public get clans(): SelectSource {
    return this.enumSelectSource(Clan);
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

  public skillGroup(form: FormGroup): { key: string, label: string }[] {
    return Object.keys(form.controls).map(k => {
      return { key: k, label: this.translate.instant(k) };
    }).sort((l, r) => (l.label > r.label) ? 1 : ((r.label > l.label) ? -1 : 0));
  }

  public submit(character: Character): void {
    this.save.emit(character);
  }
}
