import {Discipline} from "./discipline";

export type DisciplineLevel = {
  level: number,
  discipline: Discipline
}

export const disciplineLevels: { [name: string]: DisciplineLevel } = {
  'bond-famulus': <DisciplineLevel>{
    level: 1,
    discipline: Discipline.Animalism
  },
  'sense-the-beast': <DisciplineLevel>{
    level: 1,
    discipline: Discipline.Animalism
  },
};
