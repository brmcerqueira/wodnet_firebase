import {Character} from './character';

export interface DicePoll {
  withHunger: boolean;
  get(character: Character): number;
}

export const dicePolls: { [name: string]: DicePoll } = {
  'dodging': { withHunger: true, get: c => c.dexterity + c.physical.dodge },
  'flee-strength': { withHunger: true, get: c => c.strength + c.physical.athletics },
  'flee-dexterity': { withHunger: true, get: c => c.dexterity + c.physical.athletics },
  'surprise-attack': { withHunger: true, get: c => c.wits + c.physical.stealth },
  'resistance-surprise-attack': { withHunger: true, get: c => c.perception + c.mental.awareness },
  'close-combat-brawl': { withHunger: true, get: c => c.dexterity + c.physical.brawl },
  'close-combat-melee': { withHunger: true, get: c => c.dexterity + c.physical.melee },
  'composure': { withHunger: false, get: c => c.consolidateComposure - c.composure },
  'willpower': { withHunger: false, get: c => c.consolidateWillpower - c.willpower }
};
