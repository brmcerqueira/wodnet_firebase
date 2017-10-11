import {Skill} from './skill';

export const specializations: { [name: string]: Skill } = {
  'art-history': Skill.Academics,
  'literature': Skill.Academics,
  'philosophy': Skill.Academics,
  'journalism': Skill.Academics,
  'theology': Skill.Academics,
};
