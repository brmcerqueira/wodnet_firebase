import {Clan} from './clan';
import {Predator} from "./predator";
import {Damage} from "./damage";

export interface Character {
  name: string;
  ownerId: string;
  storytellerId: string;
  chronicleId: string;
  isOpen: boolean;
  experience: number;
  generation: number,
  predator: Predator;
  clan: Clan;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  composure: number;
  intelligence: number;
  wits: number;
  resolve: number;
  humanity: Damage;
  touchstones: string;
  backgroundsAndMerits: string;
  health: Damage;
  willpower: Damage;
  bloodPotency: number;
  hunger: number;
  physical: {
    athletics: number;
    brawl: number;
    crafts: number;
    dodge: number;
    drive: number;
    melee: number;
    security: number;
    stealth: number;
    survival: number;
  };
  social: {
    animalKen: number;
    empathy: number;
    etiquette: number;
    intimidation: number;
    leadership: number;
    performance: number;
    persuasion: number;
    streetwise: number;
    subterfuge: number;
  };
  mental: {
    academics: number;
    awareness: number;
    firearms: number;
    investigation: number;
    linguistics: number;
    medicine: number;
    occult: number;
    science: number;
    technology: number;
  };
  specializations: string[];
  disciplineLevels: string[];
}
