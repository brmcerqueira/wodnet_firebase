import {Character} from './character';
import {Tag} from './tag';

export interface DicePoll {
  withHunger: boolean;
  get(character: Character): number;
  tags?: Tag[];
  has?(character: Character): boolean;
}

export const dicePolls: { [name: string]: DicePoll } = {
  'dodging': <DicePoll>{
    withHunger: true,
    get: c => c.dexterity + c.physical.dodge,
    tags: [Tag.Dexterity, Tag.Dodge]
  },
  'flee-strength': <DicePoll>{
    withHunger: true,
    get: c => c.strength + c.physical.athletics,
    tags: [Tag.Strength, Tag.Athletics]
  },
  'flee-dexterity': <DicePoll>{
    withHunger: true,
    get: c => c.dexterity + c.physical.athletics,
    tags: [Tag.Dexterity, Tag.Athletics]
  },
  'surprise-attack': <DicePoll>{
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth]
  },
  'resistance-surprise-attack': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.mental.awareness,
    tags: [Tag.Resolve, Tag.Awareness]
  },
  'close-combat-brawl': <DicePoll>{
    withHunger: true,
    get: c => c.dexterity + c.physical.brawl,
    tags: [Tag.Dexterity, Tag.Brawl]
  },
  'close-combat-melee': <DicePoll>{
    withHunger: true,
    get: c => c.dexterity + c.physical.melee,
    tags: [Tag.Dexterity, Tag.Melee]
  },
  'composure': <DicePoll>{
    withHunger: false,
    get: c => c.composure
  },
  'grappling': <DicePoll>{
    withHunger: true,
    get: c => c.strength + c.physical.brawl,
    tags: [Tag.Strength, Tag.Brawl]
  },
  'ranged-combat-wits': <DicePoll>{
    withHunger: true,
    get: c => c.wits + c.mental.firearms,
    tags: [Tag.Wits, Tag.Firearms]
  },
  'ranged-combat-perception': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.mental.firearms,
    tags: [Tag.Resolve, Tag.Firearms]
  },
  'thrown-weapons': <DicePoll>{
    withHunger: true,
    get: c => c.dexterity + c.physical.athletics,
    tags: [Tag.Dexterity, Tag.Athletics]
  },
  'hunger': <DicePoll>{
    withHunger: false,
    get: c => 1
  },
  'animalism-feral-whispers': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.animalKen,
    tags: [Tag.Charisma, Tag.AnimalKen],
    has: c => c.disciplines ? c.disciplines.animalism >= 1 : false
  },
  'animalism-subsume-the-spirit': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.animalKen,
    tags: [Tag.Charisma, Tag.AnimalKen],
    has: c => c.disciplines ? c.disciplines.animalism >= 2 : false
  },
  'animalism-quell-the-beast': <DicePoll>{
    withHunger: true,
    get: c => c.manipulation + c.social.intimidation,
    tags: [Tag.Manipulation, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.animalism >= 3 : false
  },
  'resistance-animalism-quell-the-beast': <DicePoll>{
    withHunger: true,
    get: c => c.charisma,
    tags: [Tag.Charisma]
  },
  'auspex-seeing-the-invisible': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.mental.investigation,
    tags: [Tag.Resolve, Tag.Investigation],
    has: c => c.disciplines ? c.disciplines.auspex >= 1 : false
  },
  'auspex-heighten-senses': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.mental.investigation,
    tags: [Tag.Resolve, Tag.Investigation],
    has: c => c.disciplines ? c.disciplines.auspex >= 1 : false
  },
  'auspex-aura-perception': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.social.empathy,
    tags: [Tag.Resolve, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.auspex >= 2 : false
  },
  'resistance-auspex-aura-perception': <DicePoll>{
    withHunger: true,
    get: c => c.manipulation,
    tags: [Tag.Manipulation]
  },
  'auspex-spirits-touch': <DicePoll>{
    withHunger: true,
    get: c => c.resolve + c.social.empathy,
    tags: [Tag.Resolve, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.auspex >= 3 : false
  },
  'dominate-command': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.intimidation,
    tags: [Tag.Charisma, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.dominate >= 1 : false
  },
  'resistance-dominate-command': <DicePoll>{
    withHunger: true,
    get: c => c.wits,
    tags: [Tag.Wits]
  },
  'dominate-mesmerism': <DicePoll>{
    withHunger: true,
    get: c => c.manipulation + c.social.leadership,
    tags: [Tag.Manipulation, Tag.Leadership],
    has: c => c.disciplines ? c.disciplines.dominate >= 2 : false
  },
  'resistance-dominate-mesmerism': <DicePoll>{
    withHunger: true,
    get: c => c.intelligence,
    tags: [Tag.Intelligence]
  },
  'dominate-forgetful-mind': <DicePoll>{
    withHunger: true,
    get: c => c.wits + c.social.subterfuge,
    tags: [Tag.Wits, Tag.Subterfuge],
    has: c => c.disciplines ? c.disciplines.dominate >= 3 : false
  },
  'resistance-dominate-forgetful-mind': <DicePoll>{
    withHunger: true,
    get: c => c.intelligence,
    tags: [Tag.Intelligence]
  },
  'resistance-obfuscate-seeing-the-invisible': <DicePoll>{
    withHunger: true,
    get: c => c.manipulation + c.physical.stealth,
    tags: [Tag.Manipulation, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 1 : false
  },
  'obfuscate-unseen-presence': <DicePoll>{
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 2 : false
  },
  'obfuscate-mask-of-1000-faces': <DicePoll>{
    withHunger: true,
    get: c => c.wits + c.physical.stealth,
    tags: [Tag.Wits, Tag.Stealth],
    has: c => c.disciplines ? c.disciplines.obfuscate >= 3 : false
  },
  'potence-soaring-leap': <DicePoll>{
    withHunger: true,
    get: c => c.strength + c.physical.athletics,
    tags: [Tag.Strength, Tag.Athletics],
    has: c => c.disciplines ? c.disciplines.potence >= 2 : false
  },
  'presence-awe': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.persuasion,
    tags: [Tag.Charisma, Tag.Persuasion],
    has: c => c.disciplines ? c.disciplines.presence >= 1 : false
  },
  'resistance-presence-awe': <DicePoll>{
    withHunger: true,
    get: c => c.resolve,
    tags: [Tag.Resolve]
  },
  'presence-dread-gaze': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.intimidation,
    tags: [Tag.Charisma, Tag.Intimidation],
    has: c => c.disciplines ? c.disciplines.presence >= 2 : false
  },
  'resistance-presence-dread-gaze': <DicePoll>{
    withHunger: true,
    get: c => c.charisma,
    tags: [Tag.Charisma]
  },
  'presence-entrancement': <DicePoll>{
    withHunger: true,
    get: c => c.charisma + c.social.empathy,
    tags: [Tag.Charisma, Tag.Empathy],
    has: c => c.disciplines ? c.disciplines.presence >= 3 : false
  },
  'resistance-presence-entrancement': <DicePoll>{
    withHunger: true,
    get: c => c.intelligence,
    tags: [Tag.Intelligence]
  }
};
