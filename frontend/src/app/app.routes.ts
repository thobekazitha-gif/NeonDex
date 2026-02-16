import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { TypesComponent } from './components/types/types.component';
import { AbilitiesComponent } from './components/abilities/abilities.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PokemonComparisonComponent } from './components/pokemon-comparison/pokemon-comparison';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  { path: 'types', component: TypesComponent },
  { path: 'abilities', component: AbilitiesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'compare', component: PokemonComparisonComponent },
  { path: '**', redirectTo: '' }
];
