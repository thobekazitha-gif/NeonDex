<<<<<<< HEAD
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
=======
import { Component, ElementRef, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { debounceTime, distinctUntilChanged, forkJoin, Subject, catchError, of } from 'rxjs';

interface PokemonListResponse {
  count: number;
  results: any[];
}

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
<<<<<<< HEAD

=======
  
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  pokemonList = signal<any[]>([]);
<<<<<<< HEAD
  filteredPokemon = signal<any[]>([]);
  allPokemon = signal<any[]>([]); // Store all Pokemon with their details
  featuredPokemon = signal<any>(null);

=======
  featuredPokemon = signal<any>(null);
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  offset = signal<number>(0);
  totalCount = signal<number>(0);
<<<<<<< HEAD

  searchQuery = signal<string>('');
  private searchSubject = new Subject<string>();

  readonly limit = 15;
  readonly Math = Math;

  ngOnInit(): void {
    this.loadFeaturedPokemon();
    this.loadAllPokemonData();
    this.setupSearch();
    this.loadPokemon();
  }

  private loadAllPokemonData(): void {
    // Load first 151 Pokemon with full details for searching
    const firstGenIds = Array.from({ length: 151 }, (_, i) => i + 1);
    
    forkJoin(
      firstGenIds.map((id: number) =>
        this.pokemonService.getPokemonDetail(id.toString()).pipe(
          catchError(() => of(null))
        )
      )
    ).subscribe({
      next: (results) => {
        const valid = results.filter(p => p !== null);
        this.allPokemon.set(valid);
        console.log(`Loaded ${valid.length} Pokemon with full data for searching`);
      },
      error: (err) => {
        console.warn('Could not preload Pokemon data', err);
      }
    });
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      const term = (query || '').trim().toLowerCase();

      if (term.length < 2) {
        this.filteredPokemon.set([]);
        this.loadPokemon();
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      // Search through all loaded Pokemon
      const matches = this.allPokemon().filter(pokemon => {
        if (!pokemon) return false;

        // Search by name (partial match)
        const nameMatch = pokemon.name.toLowerCase().includes(term);

        // Search by type
        const typeMatch = pokemon.types?.some((t: any) => 
          t.type.name.toLowerCase().includes(term)
        );

        // Search by ability
        const abilityMatch = pokemon.abilities?.some((a: any) => 
          a.ability.name.toLowerCase().replace('-', ' ').includes(term)
        );

        return nameMatch || typeMatch || abilityMatch;
      });

      this.filteredPokemon.set(matches.slice(0, 60)); // Limit to 60 results
      this.loading.set(false);
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchSubject.next('');
    this.filteredPokemon.set([]);
    this.loadPokemon();
  }

  loadPokemon(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonList(this.offset(), this.limit).subscribe({
      next: (data: PokemonListResponse) => {
        this.pokemonList.set(data.results || []);
        this.totalCount.set(data.count || 0);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load Pokémon');
=======
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
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
        this.loading.set(false);
      }
    });
  }

<<<<<<< HEAD
  nextPage(): void {
    if (this.searchQuery().trim().length >= 2) return;
    if (this.offset() + this.limit >= this.totalCount()) return;

    this.offset.update(o => o + this.limit);
    this.loadPokemon();
    this.scrollToGrid();
  }

  prevPage(): void {
    if (this.searchQuery().trim().length >= 2) return;
    if (this.offset() <= 0) return;

    this.offset.update(o => Math.max(0, o - this.limit));
    this.loadPokemon();
    this.scrollToGrid();
  }

  scrollToGrid(): void {
    setTimeout(() => {
      this.gridSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  neuralLink(): void {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    this.router.navigate(['/pokemon', randomId]);
  }

  loadFeaturedPokemon(): void {
    this.pokemonService.getPokemonDetail('196').subscribe({
      next: (data) => this.featuredPokemon.set(data),
      error: (err) => console.error('Featured load failed', err)
    });
=======
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
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
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
