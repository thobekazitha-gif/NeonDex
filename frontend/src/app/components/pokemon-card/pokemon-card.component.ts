import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-card.component.html'
})
export class PokemonCardComponent {
  pokemon = input.required<any>();

  get id() {
    const urlParts = this.pokemon().url.split('/');
    return urlParts[urlParts.length - 2];
  }

  get imageUrl() {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
  }
}