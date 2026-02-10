import { Component, ElementRef, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PokemonCardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './pokemon-list.component.html'
})
export class PokemonListComponent implements OnInit {
  @ViewChild('gridSection') gridSection!: ElementRef;
  
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  pokemonList = signal<any[]>([]);
  featuredPokemon = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  offset = signal<number>(0);
  totalCount = signal<number>(0);
  searchQuery = '';
  selectedTypeFilter = signal<string>('all');
  
  readonly limit = 15;
  
  Math = Math;

  // Available types for filtering
  availableTypes = [
    'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  ngOnInit(): void {
    this.loadPokemon();
    this.loadFeaturedPokemon();
  }

  loadPokemon(): void {
    console.log('Loading Pokemon with offset:', this.offset(), 'limit:', this.limit);
    this.loading.set(true);
    this.error.set(null);
    
    this.pokemonService.getPokemonList(this.offset(), this.limit).subscribe({
      next: (data: any) => {
        console.log('Received Pokemon:', data.results.map((p: any) => p.name));
        this.pokemonList.set(data.results);
        this.totalCount.set(data.count);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading pokemon:', err);
        this.error.set('Neural Link failed.');
        this.loading.set(false);
      }
    });
  }

  loadFeaturedPokemon(): void {
    this.pokemonService.getPokemonDetail('196').subscribe({
      next: (data: any) => {
        this.featuredPokemon.set(data);
      },
      error: (err: any) => {
        console.error('Failed to load featured pokemon', err);
      }
    });
  }

  onSearchInput(): void {
    if (this.searchQuery.length > 2) {
      this.loading.set(true);
      this.pokemonService.getPokemonDetail(this.searchQuery.toLowerCase()).subscribe({
        next: (data: any) => {
          this.pokemonList.set([{ name: data.name, url: '' }]);
          this.loading.set(false);
        },
        error: () => {
          this.pokemonList.set([]);
          this.loading.set(false);
        }
      });
    } else if (this.searchQuery.length === 0) {
      this.loadPokemon();
    }
  }

  scrollToGrid(): void {
    setTimeout(() => {
      this.gridSection?.nativeElement?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  neuralLink(): void {
    const randomId = Math.floor(Math.random() * 800) + 1;
    this.router.navigate(['/pokemon', randomId]);
  }

  nextPage(): void {
    console.log('Next page clicked. Current offset:', this.offset());
    if (this.offset() + this.limit < this.totalCount()) {
      const newOffset = this.offset() + this.limit;
      console.log('Setting new offset to:', newOffset);
      this.offset.set(newOffset);
      this.loadPokemon();
      this.scrollToGrid();
    }
  }

  prevPage(): void {
    console.log('Previous page clicked. Current offset:', this.offset());
    if (this.offset() > 0) {
      const newOffset = Math.max(0, this.offset() - this.limit);
      console.log('Setting new offset to:', newOffset);
      this.offset.set(newOffset);
      this.loadPokemon();
      this.scrollToGrid();
    }
  }
}