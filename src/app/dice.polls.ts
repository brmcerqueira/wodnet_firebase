import {Character} from './character';

export const dicePolls: { [name: string]: (character: Character) => number } = {
  'dodging': c => c.dexterity + c.physical.dodge,
  'flee-strength': c => c.strength + c.physical.athletics,
  'flee-dexterity': c => c.dexterity + c.physical.athletics,
  'surprise-attack': c => c.wits + c.physical.stealth,
  'resistance-surprise-attack': c => c.perception + c.mental.awareness,
  'close-combat-brawl': c => c.dexterity + c.physical.brawl,
  'close-combat-melee': c => c.dexterity + c.physical.melee,
};
