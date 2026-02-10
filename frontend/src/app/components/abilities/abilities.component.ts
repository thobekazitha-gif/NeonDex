import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './abilities.component.html'
})
export class AbilitiesComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  abilities = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAbilities();
  }

  loadAbilities(): void {
    this.loading.set(true);
    // Fetch first 100 abilities
    fetch('https://pokeapi.co/api/v2/ability?limit=100')
      .then(response => response.json())
      .then(data => {
        this.abilities.set(data.results);
        this.loading.set(false);
      })
      .catch(error => {
        console.error('Failed to load abilities', error);
        this.loading.set(false);
      });
  }
}