import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonInstanceWithSprites } from '../../core/resolvers/pokemon-manager.resolver';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  getGenderIcon,
  getTextTypeClass,
  getTypeIcon,
} from '../../shared/utils/text.utils';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { Gender } from '@prisma/generated-client';
import {
  faCalendarAlt,
  faHashtag,
  faStar,
  faVenusMars,
} from '@fortawesome/free-solid-svg-icons';
import { PokemonTypeLabelComponent } from '../../shared/components/pokemon-type-label/pokemon-type-label.component';

@Component({
  selector: 'app-pokemon-manager',
  imports: [
    NgOptimizedImage,
    DatePipe,
    FontAwesomeModule,
    PokemonTypeLabelComponent,
    NgClass,
  ],
  templateUrl: './pokemon-manager.component.html',
  styleUrl: './pokemon-manager.component.scss',
})
export class PokemonManagerComponent {
  pokemonInstancesWithSprites: PokemonInstanceWithSprites[] = [];

  constructor(
    private route: ActivatedRoute,
    private library: FaIconLibrary,
  ) {
    library.addIcons(faStar, faVenusMars, faCalendarAlt, faHashtag);

    this.pokemonInstancesWithSprites = this.route.snapshot.data[
      'pokemonInstances'
    ].sort(
      (a: PokemonInstanceWithSprites, b: PokemonInstanceWithSprites) =>
        new Date(b.spawnEvent.expiresAt!).getTime() -
        new Date(a.spawnEvent.expiresAt!).getTime(),
    );
  }

  getGenderEmoji(gender: Gender) {
    return getGenderIcon(gender);
  }

  getTypeIcon(type: string) {
    return getTypeIcon(type);
  }

  getTypeTextColor(type: string) {
    return getTextTypeClass(type);
  }
}
