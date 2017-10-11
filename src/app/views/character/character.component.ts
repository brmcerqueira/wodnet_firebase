import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {SelectItem} from '../../select.item';
import {AngularFireDatabase} from 'angularfire2/database';
import {SelectSource} from '../../select.source';
import {Character} from '../../character';
import {Clan} from '../../clan';
import {TranslateService} from '@ngx-translate/core';
import {Virtue} from '../../virtue';
import {Vice} from '../../vice';
import {Discipline} from '../../discipline';
import {specializations} from '../../specialization';
import {Skill} from "../../skill";

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
  @Input() public isStoryteller: boolean;
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

  public isOpen(formGroup: FormGroup): boolean {
    return formGroup.controls.isOpen.value || this.isStoryteller;
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
        humanity: c.humanity,
        touchstones: c.touchstones,
        backgroundsAndMerits: c.backgroundsAndMerits,
        superficialDamage: c.superficialDamage,
        aggravatedDamage: c.aggravatedDamage,
        consolidateWillpower: c.consolidateWillpower,
        willpower: c.willpower,
        consolidateComposure: c.consolidateComposure,
        composure: c.composure,
        hunger: c.hunger,
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
        specializations: new FormControl(c.specializations ? c.specializations : null),
        disciplines: this.formBuilder.group(c.disciplines ? c.disciplines : {})
      });
    });
  }

  private enumSelectSource(enumObject: any, useIndex: boolean): SelectSource {
    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return Observable.create(s => {
        s.next(byKey ? [{ id: data, text: this.translate.instant(enumObject[data]) }]
          : Object.keys(enumObject).map(index => {
            const key: string = enumObject[index];
            if (!isNaN(Number(key))) {
              return null;
            }
            return {
              id: useIndex ? Number(index) : key.toLowerCase(),
              text: <string> this.translate.instant(key)
            };
          }).filter(item => {
            return item && item.text.toLowerCase().indexOf(data) > -1;
          }).sort((l, r) => l.text > r.text ? 1 : (r.text > l.text ? -1 : 0)));
      });
    };
  }

  public get virtues(): SelectSource {
    return this.enumSelectSource(Virtue, true);
  }

  public get vices(): SelectSource {
    return this.enumSelectSource(Vice, true);
  }

  public get clans(): SelectSource {
    return this.enumSelectSource(Clan, true);
  }

  public get disciplines(): SelectSource {
    return this.enumSelectSource(Discipline, false);
  }

  public get specializationsSource(): SelectSource {
    const transform = id => {
      return {
        id: id,
        text: `${this.translate.instant(Skill[specializations[id]].toLowerCase())} - ${this.translate.instant(id)}`
      };
    };

    return (data: any, byKey: boolean): Observable<SelectItem[]> => {
      return Observable.create(s => {
        s.next(byKey
          ? (<string[]>data).map(transform)
          : Object.keys(specializations).map(transform).filter(item => {
            return item.text.toLowerCase().indexOf(data) > -1;
          }));
      });
    };
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

  public createDisciplineControl(): AbstractControl {
    return new FormControl(1);
  }

  public submit(character: Character): void {
    this.save.emit(character);
  }
}
