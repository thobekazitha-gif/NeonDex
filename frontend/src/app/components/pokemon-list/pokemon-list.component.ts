import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  pokemonList = signal<any[]>([]);
  filteredPokemon = signal<any[]>([]);
  allPokemon = signal<any[]>([]); 
  featuredPokemon = signal<any>(null);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  offset = signal<number>(0);
  totalCount = signal<number>(0);

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
      },
      error: (err) => console.warn('Could not preload Pokemon data', err)
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
      const matches = this.allPokemon().filter(pokemon => {
        if (!pokemon) return false;
        const nameMatch = pokemon.name.toLowerCase().includes(term);
        const typeMatch = pokemon.types?.some((t: any) => t.type.name.toLowerCase().includes(term));
        const abilityMatch = pokemon.abilities?.some((a: any) => a.ability.name.toLowerCase().replace('-', ' ').includes(term));
        return nameMatch || typeMatch || abilityMatch;
      });

      this.filteredPokemon.set(matches.slice(0, 60));
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
        this.loading.set(false);
      }
    });
  }

  loadFeaturedPokemon(): void {
    this.pokemonService.getPokemonDetail('196').subscribe({
      next: (data) => this.featuredPokemon.set(data),
      error: (err) => console.error('Featured load failed', err)
    });
  }

  nextPage(): void {
    if (this.searchQuery().trim().length >= 2) return;
    if (this.offset() + this.limit < this.totalCount()) {
      this.offset.update(o => o + this.limit);
      this.loadPokemon();
      this.scrollToGrid();
    }
  }

  prevPage(): void {
    if (this.searchQuery().trim().length >= 2) return;
    if (this.offset() > 0) {
      this.offset.update(o => Math.max(0, o - this.limit));
      this.loadPokemon();
      this.scrollToGrid();
    }
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
}