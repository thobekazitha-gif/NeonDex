import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PokemonCardComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];
  loading = true;
  error: string | null = null;
  offset = 0;
  limit = 20;
  searchQuery = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPokemon();
  }

  fetchPokemon() {
    this.loading = true;
    this.error = null;
    this.http.get<any>(`http://localhost:3000/pokemon?limit=${this.limit}&offset=${this.offset}`)
      .subscribe({
        next: (res) => {
          this.pokemonList = res.results;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load Pokémon list';
          this.loading = false;
        }
      });
  }

  nextPage() {
    this.offset += this.limit;
    this.fetchPokemon();
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.fetchPokemon();
    }
  }

  searchPokemon() {
    if (this.searchQuery.trim()) {
      window.location.href = `/pokemon/${this.searchQuery.trim().toLowerCase()}`;
    }
  }
}