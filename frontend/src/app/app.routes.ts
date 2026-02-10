import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { AbilitiesComponent } from './components/abilities/abilities.component';
import { TypesComponent } from './components/types/types.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  { path: 'abilities', component: AbilitiesComponent },
  { path: 'types', component: TypesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];