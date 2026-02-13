import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
<<<<<<< HEAD
import { TypesComponent } from './components/types/types.component';
import { AbilitiesComponent } from './components/abilities/abilities.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PokemonComparisonComponent } from './components/pokemon-comparison/pokemon-comparison';
=======
import { AbilitiesComponent } from './components/abilities/abilities.component';
import { TypesComponent } from './components/types/types.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
<<<<<<< HEAD
  { path: 'types', component: TypesComponent },
  { path: 'abilities', component: AbilitiesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'compare', component: PokemonComparisonComponent },
  { path: '**', redirectTo: '' }
];
=======
  { path: 'abilities', component: AbilitiesComponent },
  { path: 'types', component: TypesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
