import {Character} from './character';
import {Tag} from './tag';

export interface DicePoll {
  withHunger: boolean;
  get(character: Character): number;
  tags?: Tag[];
  has?(character: Character): boolean;
}

export const dicePolls: { [name: string]: DicePoll } = {
  'dodging': {
    withHunger: true,
    get: c => c.dexterity + c.physical.dodge,
    tags: [Tag.Dexterity, Tag.Dodge]
  },
  'flee-strength': {
    withHunger: true,
    get: c => c.strength + c.physical.athletics,
    tags: [Tag.Strength, Tag.Athletics]
  },
  'flee-dexterity': {
    withHunger: true,
    get: c => c.dexterity + c.physical.athletics,
    tags: [Tag.Dexterity, Tag.Athletics]
  },
  'surprise-attack': {
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth]
  },
  'resistance-surprise-attack': {
    withHunger: true,
    get: c => c.perception + c.mental.awareness,
    tags: [Tag.Perception, Tag.Awareness]
  },
  'close-combat-brawl': {
    withHunger: true,
    get: c => c.dexterity + c.physical.brawl,
    tags: [Tag.Dexterity, Tag.Brawl]
  },
  'close-combat-melee': {
    withHunger: true,
    get: c => c.dexterity + c.physical.melee,
    tags: [Tag.Dexterity, Tag.Melee]
  },
  'composure': {
    withHunger: false,
    get: c => c.consolidateComposure - c.composure
  },
  'willpower': {
    withHunger: false,
    get: c => c.consolidateWillpower - c.willpower
  },
  'grappling': {
    withHunger: true,
    get: c => c.strength + c.physical.brawl,
    tags: [Tag.Strength, Tag.Brawl]
  },
  'ranged-combat-wits': {
    withHunger: true,
    get: c => c.wits + c.mental.firearms,
    tags: [Tag.Wits, Tag.Firearms]
  },
  'ranged-combat-perception': {
    withHunger: true,
    get: c => c.perception + c.mental.firearms,
    tags: [Tag.Perception, Tag.Firearms]
  },
  'thrown-weapons': {
    withHunger: true,
    get: c => c.dexterity + c.physical.athletics,
    tags: [Tag.Dexterity, Tag.Athletics]
  },
  'hunger': {
    withHunger: false,
    get: c => 1
  },
  'animalism-feral-whispers': {
    withHunger: true,
    get: c => c.charisma + c.social.animalKen,
    tags: [Tag.Charisma, Tag.AnimalKen],
    has: c => c.disciplines ? c.disciplines.animalism >= 1 : false
  },
  'animalism-subsume-the-spirit': {
    withHunger: true,
    get: c => c.charisma + c.social.animalKen,
    tags: [Tag.Charisma, Tag.AnimalKen],
    has: c => c.disciplines ? c.disciplines.animalism >= 2 : false
  },
  'animalism-quell-the-beast': {
    withHunger: true,
    get: c => c.manipulation + c.social.intimidation,
    tags: [Tag.Manipulation, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.animalism >= 3 : false
  },
  'resistance-animalism-quell-the-beast': {
    withHunger: true,
    get: c => c.charisma + c.willpower,
    tags: [Tag.Charisma]
  }
};
