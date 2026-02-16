import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './types.component.html'
})
export class TypesComponent implements OnInit {
  types = signal<any[]>([]);
  loading = signal<boolean>(true);

  typeColors: { [key: string]: string } = {
    normal: 'bg-slate-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-emerald-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-slate-800',
    steel: 'bg-slate-500',
    fairy: 'bg-pink-400'
  };

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    this.loading.set(true);
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => {
        // Filter out unknown and shadow types
        const filteredTypes = data.results.filter((type: any) => 
          type.name !== 'unknown' && type.name !== 'shadow'
        );
        this.types.set(filteredTypes);
        this.loading.set(false);
      })
      .catch(error => {
        console.error('Failed to load types', error);
        this.loading.set(false);
      });
  }

  getTypeColor(typeName: string): string {
    return this.typeColors[typeName] || 'bg-slate-500';
  }

  getRandomFrequency(): number {
    return Math.floor(Math.random() * 999);
  }
}
