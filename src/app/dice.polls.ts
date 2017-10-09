import {Character} from './character';

export const dicePolls: { [name: string]: (character: Character) => number } = {
  'dodging': c => c.dexterity + c.physical.dodge,
  'flee-strength': c => c.strength + c.physical.athletics,
  'flee-dexterity': c => c.dexterity + c.physical.athletics,
};
