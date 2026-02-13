import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-fuchsia-500/20 shadow-[0_4px_20px_rgba(217,70,239,0.1)]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="relative w-12 h-12">
              <!-- Outer glow ring -->
              <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-md"></div>
              <!-- Main circle -->
              <div class="relative w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform border border-fuchsia-400/50">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
              </div>
            </div>
            <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-300 group-hover:from-fuchsia-300 group-hover:via-purple-300 group-hover:to-fuchsia-200 transition-all tracking-tight">
              NeonDex
            </span>
          </a>

          <!-- Navigation Links -->
          <div class="flex items-center gap-2">
            <!-- Browse Link -->
            <a 
              routerLink="/"
              routerLinkActive="text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-300 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 border border-transparent hover:border-fuchsia-500/30 transition-all">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse
            </a>

            <!-- Types Link -->
            <a 
              routerLink="/types"
              routerLinkActive="text-purple-400 bg-purple-500/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              class="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Types
            </a>

            <!-- Abilities Link -->
            <a 
              routerLink="/abilities"
              routerLinkActive="text-cyan-400 bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              class="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Abilities
            </a>

            <!-- Favorites Link with Badge -->
            <a 
              routerLink="/favorites"
              routerLinkActive="text-pink-400 bg-pink-500/20 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              class="relative px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-300 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites
              
              <!-- Badge -->
              @if (favoritesCount() > 0) {
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.6)] border border-pink-400/50">
                  {{ favoritesCount() > 99 ? '99+' : favoritesCount() }}
                </span>
              }
            </a>

            <!-- NEW: Battle Sim Link -->
            <a 
              routerLink="/compare"
              routerLinkActive="text-indigo-400 bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              class="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 transition-all flex items-center gap-2">
              <span>⚔️</span> Battle Sim
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    @keyframes glow-pulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(217, 70, 239, 0.3);
      }
      50% {
        box-shadow: 0 0 30px rgba(217, 70, 239, 0.5);
      }
    }
  `]
})
export class NavbarComponent {
  private favoritesService = inject(FavoritesService);
  
  favoritesCount = this.favoritesService.favoritesCount;
}