import { Gender } from '@prisma/generated-client';
import {
  faBolt,
  faBug,
  faCircle,
  faCog,
  faDragon,
  faEye,
  faFeather,
  faFire,
  faFistRaised,
  faFlaskVial,
  faGem,
  faGhost,
  faHatWizard,
  faMoon,
  faMountain,
  faQuestionCircle,
  faSeedling,
  faSnowflake,
  faWater,
} from '@fortawesome/free-solid-svg-icons';

export function getGenderIcon(gender: Gender) {
  if (gender === 'MALE') return '♂️';
  if (gender === 'FEMALE') return '♀️';
  return '⚧️';
}

export function getTypeIcon(type: string) {
  switch (type) {
    case 'normal':
      return faCircle;
    case 'fire':
      return faFire;
    case 'water':
      return faWater;
    case 'grass':
      return faSeedling;
    case 'electric':
      return faBolt;
    case 'ice':
      return faSnowflake;
    case 'fighting':
      return faFistRaised;
    case 'poison':
      return faFlaskVial;
    case 'ground':
      return faMountain;
    case 'flying':
      return faFeather;
    case 'psychic':
      return faEye;
    case 'bug':
      return faBug;
    case 'rock':
      return faGem;
    case 'ghost':
      return faGhost;
    case 'dragon':
      return faDragon;
    case 'dark':
      return faMoon;
    case 'steel':
      return faCog;
    case 'fairy':
      return faHatWizard;
    default:
      return faQuestionCircle;
  }
}

export function getTextTypeClass(type: string): string {
  switch (type) {
    case 'normal':
      return 'text-type-normal';
    case 'fire':
      return 'text-type-fire';
    case 'water':
      return 'text-type-water';
    case 'grass':
      return 'text-type-grass';
    case 'electric':
      return 'text-type-electric';
    case 'ice':
      return 'text-type-ice';
    case 'fighting':
      return 'text-type-fighting';
    case 'poison':
      return 'text-type-poison';
    case 'ground':
      return 'text-type-ground';
    case 'flying':
      return 'text-type-flying';
    case 'psychic':
      return 'text-type-psychic';
    case 'bug':
      return 'text-type-bug';
    case 'rock':
      return 'text-type-rock';
    case 'ghost':
      return 'text-type-ghost';
    case 'dragon':
      return 'text-type-dragon';
    case 'dark':
      return 'text-type-dark';
    case 'steel':
      return 'text-type-steel';
    case 'fairy':
      return 'text-type-fairy';
    default:
      return 'text-neutral-400'; // Default background for unknown types
  }
}
