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
  },
  'auspex-seeing-the-invisible': {
    withHunger: true,
    get: c => c.perception + c.mental.investigation,
    tags: [Tag.Perception, Tag.Investigation],
    has: c => c.disciplines ? c.disciplines.auspex >= 1 : false
  },
  'auspex-heighten-senses': {
    withHunger: true,
    get: c => c.perception + c.mental.investigation,
    tags: [Tag.Perception, Tag.Investigation],
    has: c => c.disciplines ? c.disciplines.auspex >= 1 : false
  },
  'auspex-aura-perception': {
    withHunger: true,
    get: c => c.perception + c.social.empathy,
    tags: [Tag.Perception, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.auspex >= 2 : false
  },
  'resistance-auspex-aura-perception': {
    withHunger: true,
    get: c => c.manipulation + c.willpower,
    tags: [Tag.Manipulation]
  },
  'auspex-spirits-touch': {
    withHunger: true,
    get: c => c.perception + c.social.empathy,
    tags: [Tag.Perception, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.auspex >= 3 : false
  },
  'dominate-command': {
    withHunger: true,
    get: c => c.charisma + c.social.intimidation,
    tags: [Tag.Charisma, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.dominate >= 1 : false
  },
  'resistance-dominate-command': {
    withHunger: true,
    get: c => c.wits + c.willpower,
    tags: [Tag.Wits]
  },
  'dominate-mesmerism': {
    withHunger: true,
    get: c => c.manipulation + c.social.leadership,
    tags: [Tag.Manipulation, Tag.Leadership],
    has: c => c.disciplines ? c.disciplines.dominate >= 2 : false
  },
  'resistance-dominate-mesmerism': {
    withHunger: true,
    get: c => c.intelligence + c.willpower,
    tags: [Tag.Intelligence]
  },
  'dominate-forgetful-mind': {
    withHunger: true,
    get: c => c.wits + c.social.subterfuge,
    tags: [Tag.Wits, Tag.Subterfuge],
    has: c => c.disciplines ? c.disciplines.dominate >= 3 : false
  },
  'resistance-dominate-forgetful-mind': {
    withHunger: true,
    get: c => c.intelligence + c.willpower,
    tags: [Tag.Intelligence]
  },
  'resistance-obfuscate-seeing-the-invisible': {
    withHunger: true,
    get: c => c.manipulation + c.physical.stealth,
    tags: [Tag.Manipulation, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 1 : false
  },
  'obfuscate-unseen-presence': {
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 2 : false
  },
  'obfuscate-mask-of-1000-faces': {
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 3 : false
  },
  'potence-soaring-leap': {
    withHunger: true,
    get: c => c.strength + c.physical.athletics,
    tags: [Tag.Strength, Tag.Athletics],
    has: c => c.disciplines ? c.disciplines.potence >= 2 : false
  },
  'presence-awe': {
    withHunger: true,
    get: c => c.charisma + c.social.persuasion,
    tags: [Tag.Charisma, Tag.Persuasion],
    has: c => c.disciplines ? c.disciplines.presence >= 1 : false
  },
  'resistance-presence-awe': {
    withHunger: true,
    get: c => c.perception + c.willpower,
    tags: [Tag.Perception]
  },
  'presence-dread-gaze': {
    withHunger: true,
    get: c => c.charisma + c.social.intimidation,
    tags: [Tag.Charisma, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.presence >= 2 : false
  },
  'resistance-presence-dread-gaze': {
    withHunger: true,
    get: c => c.charisma + c.willpower,
    tags: [Tag.Charisma]
  },
  'presence-entrancement': {
    withHunger: true,
    get: c => c.charisma + c.social.empathy,
    tags: [Tag.Charisma, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.presence >= 3 : false
  },
  'resistance-presence-entrancement': {
    withHunger: true,
    get: c => c.intelligence + c.willpower,
    tags: [Tag.Intelligence]
  }
};
