# NeonDex - Pokémon Explorer Application

> A modern, cyberpunk-themed Pokémon exploration web application built with Angular 19 and powered by PokéAPI.

[![Live Demo](https://img.shields.io/badge/_Live_Demo-neondex--22.netlify.app-brightgreen)](https://neondex-22.netlify.app)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

##  Table of Contents

- [Overview](#overview)
- [Live Deployment](#live-deployment)
- [Features](#features)
- [API Choice](#api-choice)
- [Architecture Decisions](#architecture-decisions)
- [Data Transformations](#data-transformations)
- [Caching Strategy](#caching-strategy)
- [Design Principles Applied](#design-principles-applied)
- [Technologies](#technologies)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [What I Would Add With More Time](#what-i-would-add-with-more-time)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

##  Overview

NeonDex is a single-page application that provides an interactive interface for browsing, searching, and managing favourite Pokémon. The application features a distinctive neon-cyberpunk aesthetic with glass morphism effects, gradient backgrounds, and glowing UI elements.

---

##  Live Deployment

**[→ View Live Application](https://neondex-22.netlify.app)**

The application is deployed on Netlify with automatic deployments triggered on every push to the `main` branch.

---

##  Features

### Core Functionality

- **Pokemon Browsing** — Paginated list view with responsive grid layout displaying Pokémon cards
- **Search and Filter** — Search Pokémon by name, type, or abilities with real-time filtering
- **Detailed View** — Comprehensive Pokémon information including stats, types, abilities, and physical characteristics
- **Favourites Management** — Add, remove, and organise favourite Pokémon with persistent storage
- **Type and Ability Explorer** — Dedicated pages for exploring Pokémon types and abilities
- **Battle Simulator** — Compare two Pokémon using type effectiveness, base stats, and speed
- **Neural Link** — Random Pokémon discovery feature with cyberpunk theming

### Advanced Features

- **Computed Statistics** — Strongest stat highlighting, BST calculation, power rating classification, type-based grouping
- **Multiple Sorting Options** — Sort favourites by date added, name, or Pokédex number
- **Responsive Design** — Fully responsive interface adapting to mobile, tablet, and desktop screens
- **Persistent Storage** — Favourites stored in browser LocalStorage for persistence across sessions

---

##  API Choice

### Why PokéAPI?

NeonDex uses **[PokéAPI](https://pokeapi.co/api/v2/)** as its sole data source. This decision was made for the following reasons:

#### 1. Comprehensive and Free

PokéAPI provides complete data for all Pokémon across all generations — including stats, types, abilities, sprites, evolution chains, and species data — at no cost and with no API key required. This eliminated authentication complexity entirely and made the app accessible to any developer cloning the repo.

#### 2. RESTful and Predictable

The API follows consistent URL patterns (`/pokemon/{id}`, `/type/{name}`, `/ability/{name}`), making it easy to build a service layer that maps cleanly to TypeScript interfaces. JSON responses are well-structured and thoroughly documented at [pokeapi.co/docs/v2](https://pokeapi.co/docs/v2).

#### 3. Reliable and CDN-Backed

PokéAPI serves data from a globally distributed CDN with 24-hour `Cache-Control` headers on responses. Repeat requests are handled at the browser or CDN level without hitting the origin server.

#### 4. No Backend Database Required

All Pokémon data is fetched directly from PokéAPI at runtime. The Express backend exists only to serve the compiled Angular application as static files — it makes zero database calls. This kept the architecture simple and the deployment cost at zero.

### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /pokemon?limit={n}&offset={n}` | Paginated Pokémon list |
| `GET /pokemon/{id or name}` | Detailed Pokémon data (stats, types, sprites) |
| `GET /pokemon-species/{id or name}` | Species data for flavour text and evolution |
| `GET /evolution-chain/{id}` | Full evolution chain data |
| `GET /type/{id or name}` | Type relationships and effectiveness |
| `GET /ability/{id or name}` | Ability descriptions |

---

##  Architecture Decisions

### 1. Standalone Components (No NgModules)

Angular 19's standalone components are used throughout the application. This removes the need for `NgModule` declarations entirely, reduces boilerplate, improves tree-shaking, and simplifies lazy loading. Each component explicitly declares its own imports, making dependencies obvious at a glance.

```typescript
@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-card.component.html'
})
export class PokemonCardComponent { }
```

### 2. Angular Signals for State Management

Local state is managed using Angular Signals rather than RxJS BehaviourSubjects. Signals provide fine-grained reactivity with automatic dependency tracking, removing the need for manual subscriptions and reducing memory leak risk. `computed()` signals derive state automatically — for example, `groupedPokemon` recomputes whenever the base `pokemonList` signal updates.

```typescript
pokemonList = signal<Pokemon[]>([]);

groupedPokemon = computed(() => {
  const all = this.pokemonService.pokemonList();
  const grouped: { [key: string]: any[] } = {};
  this.allTypes.forEach(type => {
    grouped[type] = all.filter(p =>
      p.types?.some((t: any) => t.type.name === type)
    );
  });
  return grouped;
});
```

RxJS Observables are used only for HTTP calls (where they are most appropriate), with `forkJoin` for parallel requests.

### 3. Service Layer Architecture

A clear separation exists between data fetching (service layer) and presentation (component layer):

- **`PokemonService`** — handles all API communication, in-memory caching, battle simulation logic, and the full type effectiveness chart
- **`FavoritesService`** — manages favourites state, LocalStorage persistence, and sorting logic
- **Components** — consume signals from services and handle only presentation and user interaction logic

### 4. Client-Side Only Architecture

No custom backend API exists. The Express server serves only the compiled Angular SPA as static files. This decision reduced infrastructure complexity, deployment cost, and development time while keeping the codebase focused on the frontend.

### 5. Tailwind CSS Utility-First Styling

Tailwind CSS is used in preference to a component library or custom CSS architecture. This enables rapid development, eliminates naming convention debates (no BEM required), keeps the bundle small through unused-class purging, and makes responsive design straightforward using breakpoint prefixes such as `md:` and `lg:`.

---

##  Data Transformations

NeonDex performs several transformations on raw PokéAPI data before it reaches the UI.

### 1. Base Stat Total (BST) Calculation

PokéAPI returns individual stats as an array. The service sums all base stat values and attaches a single `bst` number to each Pokémon object at load time:

```typescript
const bst = results.stats.reduce(
  (sum: number, stat: any) => sum + stat.base_stat, 0
);
return { ...results, bst };
```

BST drives the power rating classification (Basic / Standard / Advanced / Elite / Legendary) and the "Strongest per Type" feature.

### 2. Strongest Stat Identification

For the detail view, the application computes which stat is highest and highlights it:

```typescript
getStrongestStat(pokemon: any): string {
  const max = Math.max(...pokemon.stats.map((s: any) => s.base_stat));
  return pokemon.stats.find((s: any) => s.base_stat === max)?.stat.name || '';
}
```

### 3. Type-Based Grouping

The Types page and Favourites page both require Pokémon grouped by primary type. A `computed()` signal produces a `Record<string, Pokemon[]>` object from the flat `pokemonList` signal:

```typescript
groupedPokemon = computed(() => {
  const all = this.pokemonService.pokemonList();
  const grouped: { [key: string]: any[] } = {};
  this.allTypes.forEach(type => {
    grouped[type] = all.filter(p =>
      p.types?.some((t: any) => t.type.name === type)
    );
  });
  return grouped;
});
```

### 4. Name Formatting

PokéAPI returns names in lowercase with hyphens (e.g. `mr-mime`, `nidoran-f`). These are transformed for display:

```typescript
formatName(name: string): string {
  return name.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
// "mr-mime" → "Mr Mime"
// "nidoran-f" → "Nidoran F"
```

### 5. Battle Score Computation

The battle simulator transforms raw stat arrays into a weighted composite score using type effectiveness multipliers, speed values, and defensive resilience:

```typescript
const finalScoreA =
  totalA * 0.50 +     // Base stat total
  speedA * 0.20 +     // Speed advantage
  typeAdvA * 30 +     // Type effectiveness multiplier
  defScoreA * 0.8;    // Defensive resilience score
```

Win probability is clamped to 5%–95% to avoid unrealistic certainty.

### 6. Type Effectiveness Matrix

The full 18×18 type chart is stored as a plain JavaScript object in `PokemonService`. It powers both offensive advantage scores and defensive resilience calculations without any external library:

```typescript
private typeChart: { [key: string]: TypeEffectiveness } = {
  fire:  { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  dark:  { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  // ... all 18 types
};
```

---

##  Caching Strategy

NeonDex uses a multi-layer caching strategy to reduce API calls and improve perceived performance.

### Layer 1 — In-Memory Signal Cache (Session)

Once Pokémon are loaded into the `pokemonList` signal, they stay in memory for the lifetime of the browser session. The `allPokemonLoaded` guard prevents duplicate network requests:

```typescript
async loadAllPokemon(limit: number = 300): Promise<void> {
  if (this.allPokemonLoaded()) return; // Return immediately if already loaded
  // ... fetch and populate signal
  this.allPokemonLoaded.set(true);
}
```

**Trade-off:** Cleared on page refresh. Does not persist across sessions.

### Layer 2 — Browser HTTP Cache (24 Hours)

PokéAPI responses include `Cache-Control: public, max-age=86400` headers. The browser caches individual Pokémon responses for 24 hours, so navigating between pages or soft-refreshing does not re-fetch already-seen data.

### Layer 3 — LocalStorage (Persistent)

User favourites are persisted to `localStorage` and restored on the next visit:

```typescript
private loadFromStorage(): FavoritePokemon[] {
  try {
    const data = localStorage.getItem('neondex-favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
```

**Trade-off:** Synchronous API, device-specific, cleared with browser data.

### Layer 4 — PokéAPI CDN (Global)

PokéAPI is served from a global CDN. Requests for the same resource from multiple users worldwide are answered from the nearest edge node rather than the origin server, keeping latency low.

### Summary

| Layer | Scope | Duration | What It Caches |
|-------|-------|----------|----------------|
| Angular Signal | Session | Until refresh | All loaded Pokémon objects |
| Browser HTTP Cache | Device | 24 hours | Individual API responses |
| LocalStorage | Device | Persistent | User favourites |
| PokéAPI CDN | Global | 24 hours | All PokéAPI responses |

---

##  Design Principles Applied

### 1. Clarity — Reducing Cognitive Load

**How it was applied:** The interface uses progressive disclosure — showing only the most essential information on list cards, and revealing full detail only on the dedicated detail page. Type badges use distinct, type-specific colours consistent with official Pokémon games, so users recognise types instantly without reading text. The cyberpunk visual style is applied uniformly so the theme itself never competes with the data.

**Concrete example — Browse Page:** Each card on the Browse page shows only the Pokémon sprite, name, Pokédex number, and type badges. Stat bars, ability lists, and species descriptions are intentionally absent. When a user clicks through to the detail page, the additional information appears in clearly labelled sections. This prevents information overload and allows fast visual scanning of the grid.

---

### 2. Consistency — Reusable Patterns and Behaviours

**How it was applied:** The same `app-pokemon-card` component is rendered on the Browse page, the Types page, and the Favourites page. The same `app-favorite-button` appears both on cards and on the detail page. Button styles, hover effects (scale + neon glow shadow), type badge colours, and card border radii are defined once using Tailwind design tokens and applied uniformly across every screen.

**Concrete example — Favourite Button:** Whether the user is on the Browse grid, the Pokémon detail page, or the battle simulator selection screen, the heart button looks and behaves identically — filled fuchsia when active, outlined when inactive, scaling slightly on hover, and animating on click. Users never need to re-learn the interaction.

```typescript
// The same component reused across all views
<app-favorite-button [pokemonId]="pokemon.id"></app-favorite-button>
```

---

### 3. Feedback — Communicating System State

**How it was applied:** Every asynchronous operation has an explicit loading, success, and error state, each rendered differently in the UI. Angular Signals ensure that state-derived UI (such as the favourites count badge) updates synchronously the moment state changes — no page reload required.

**Concrete example — Types Page (Aether Matrices):** While data loads, a spinning border animation appears with a pulsing label. If the API call fails, an error card renders with a descriptive message and a "Retry Neural Link" button. Once data loads successfully, the type grid renders. There is never a blank screen or a silent failure — every possible state is explicitly handled:

```html
@if (loading()) {
  <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-fuchsia-500"></div>
} @else if (error()) {
  <div class="text-red-400">{{ error() }}</div>
  <button (click)="ngOnInit()">Retry Neural Link</button>
} @else {
  <!-- Type grid with populated Pokémon -->
}
```

The Favourites count badge in the navbar also updates in real-time via a computed signal, giving immediate confirmation that a heart-click was registered.

---

### 4. Accessibility — Supporting Diverse Users

**How it was applied:** Interactive elements are keyboard-navigable and have visible focus indicators using `focus-visible:outline`. Type badges and text elements use colours with sufficient contrast against the dark background. Semantic HTML (`<main>`, `<nav>`, `<article>`, `<h1>`–`<h3>`, `<button>`) is used throughout so screen readers correctly interpret page structure. Image elements include descriptive `alt` attributes.

**Concrete example — Favourite Button ARIA Label:** The favourite toggle button has a dynamic `aria-label` that changes based on current state, giving screen reader users accurate context:

```html
<button
  [attr.aria-label]="isFavorite()
    ? 'Remove ' + pokemon.name + ' from favourites'
    : 'Add ' + pokemon.name + ' to favourites'"
  (click)="toggleFavorite($event)"
  class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-400"
>
```

White text on the dark background (`#0f172a`) achieves a contrast ratio well above the 4.5:1 WCAG AA minimum. Type badge colours (e.g. dark type `#705848` with white text) were selected to meet the same standard.

---

### 5. Efficiency — Minimising Friction

**How it was applied:** The most common action — adding a Pokémon to favourites — requires a single click directly from the Browse grid, with no navigation required. The Neural Link button provides instant random discovery. The battle simulator allows users to search and select Pokémon without leaving the page. Sort controls on the Favourites page allow immediate reordering without any modal or settings screen.

**Concrete example — One-Click Favouriting:** In a conventional app, adding a favourite might require: click card → navigate to detail → scroll to find button → click → navigate back. In NeonDex, the entire flow is a single click on the heart icon in the card corner. `stopPropagation()` ensures the click does not also trigger card navigation:

```typescript
toggleFavorite(event: Event): void {
  event.stopPropagation(); // Prevents card click-through to detail page
  this.favoritesService.toggleFavorite(this.pokemon);
}
```

This reduces a 5-step flow to 1 step, making favouriting fast enough that users do it habitually as they browse.

---

##  Technologies

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 19.0.0 | Application framework |
| TypeScript | 5.6.0 | Type-safe JavaScript |
| RxJS | 7.8.0 | Reactive HTTP communication |
| Tailwind CSS | 3.4.0 | Utility-first styling |
| Angular Signals | Built-in | Local state management |
| Angular Router | 19.0.0 | Client-side routing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.18.0 | Static file server |
| Node.js | 18+ | Runtime environment |

### External Services

| Service | Purpose |
|---------|---------|
| PokéAPI | All Pokémon data |
| Netlify | Hosting and continuous deployment |

---

##  Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/thobekazitha-gif/NeonDex.git
cd NeonDex

# Install frontend dependencies
cd frontend
npm install

# Run development server
npm start
# Open http://localhost:4200
```

### Production Build

```bash
# Build for production
cd frontend
npm run build

# Serve with Express backend
cd ../backend
npm install
node server.js
# Open http://localhost:3000
```

---

##  Project Structure

```
NeonDex/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── pokemon-list/       # Browse page with pagination
│   │   │   │   ├── pokemon-detail/     # Full Pokémon detail page
│   │   │   │   ├── pokemon-card/       # Reusable card component
│   │   │   │   ├── favorites/          # Favourites management
│   │   │   │   ├── favorite-button/    # Toggle favourite button
│   │   │   │   ├── navbar/             # Navigation bar
│   │   │   │   ├── loading-spinner/    # Loading state component
│   │   │   │   ├── error-message/      # Error display component
│   │   │   │   ├── types/              # Type explorer (Aether Matrices)
│   │   │   │   ├── abilities/          # Ability explorer
│   │   │   │   └── battle-sim/         # Battle simulator
│   │   │   ├── services/
│   │   │   │   ├── pokemon.service.ts  # API, caching, battle logic, type chart
│   │   │   │   └── favorites.service.ts # Favourites state + LocalStorage
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── styles.css
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/
│   ├── server.js
│   └── package.json
└── README.md
```

---

##  Known Limitations

### 1. Limited Pokémon Dataset

The application loads the first 300 Pokémon to keep initial load times reasonable. Pokémon from Generations 4–9 (numbers 387+) are not available in the type explorer or battle simulator unless browsed individually via the paginated list.

### 2. No User Authentication

Favourites are stored in `localStorage`, meaning they are device-specific. There is no way to sync favourites across devices or share collections with other users.

### 3. No Offline Support

The application requires an active internet connection. There is no Service Worker or offline cache, so users on poor connections may see long loading states or errors.

### 4. Simplified Battle Simulator

The battle engine uses a weighted score model based on base stats, speed, and type effectiveness. It does not account for moves, held items, abilities, weather conditions, status effects, or EVs/IVs — all of which significantly affect real Pokémon battles. Results are educational estimates only.

### 5. Search Scope Is Page-Limited

The search on the Browse page filters only within the currently visible page of 15 results. It does not search across all 1000+ Pokémon simultaneously.

### 6. No Image Fallbacks

If the official artwork URL returns a 404 for a regional variant or alternate form, the image renders as a broken link with no placeholder shown.

### 7. Deployment Rate Limiting

The Vercel free tier has a limit of approximately 100 deployments per 24-hour period. During active development with multiple branches, this limit can be reached, causing deployment failures on pull requests. The project was migrated to Netlify to work around this.

---

##  What I Would Add With More Time

### High Priority

**Full Pokémon Dataset with Background Loading**
Implement progressive loading to fetch all 1000+ Pokémon in the background without blocking the UI. A subtle progress bar would indicate loading status while the app remains fully usable.

**User Accounts with Cloud Sync**
Integrate Firebase Authentication and Firestore to allow users to create accounts, persist favourites to the cloud, and access them from any device.

**Accurate Battle Simulator**
Expand the battle engine to account for abilities (e.g. Intimidate, Levitate, Speed Boost), held items, weather effects, priority moves, and Pokémon-specific mechanics such as Aegislash's stance change and Cherrim's Flower Gift.

### Medium Priority

**Team Builder with Type Coverage Analysis**
Allow users to assemble teams of 6 Pokémon and automatically calculate offensive coverage and defensive weaknesses using the full type chart.

**Pokémon Comparison Tool**
Side-by-side stat bar comparison for up to 4 Pokémon on a single screen.

**Evolution Chain Visualisation**
An interactive, branching evolution tree on the detail page, covering all conditions (level, stone, trade, friendship, location) and alternate forms.

**Progressive Web App (PWA)**
Add a Service Worker for offline access, a `manifest.json` for home screen installation, and background sync.

### Lower Priority

**Full-Text Search Across All Pokémon**
Implement a dedicated search endpoint or integrate Algolia to support instant name, ability, and move search across the entire roster.

**Dark / Light Mode Toggle**
Add a high-contrast light mode as an accessibility option alongside the default cyberpunk dark theme.

**Automated Testing**
Write unit tests for the battle simulator, computed signals, and service methods. Add E2E tests with Playwright for core user flows.

**Multi-Language Support**
PokéAPI provides names and descriptions in multiple languages. i18n support would make the application accessible to a global audience.

---

##  Screenshots

> Screenshots of the live application at [neondex-22.netlify.app](https://neondex-22.netlify.app)

**Browse Page** — Responsive grid with real-time search and one-click favouriting

**Types Page (Aether Matrices)** — Type explorer with grouped Pokémon and Strongest Only mode

**Pokémon Detail Page** — Full stat breakdown, BST, power rating, and type badges

**Battle Simulator** — Side-by-side comparison with win probability and type advantage breakdown

**Favourites Page** — Sorted collection with three sort modes

---

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using Conventional Commits format
4. Push to your fork and open a pull request

**Commit format examples:**
```
feat: add evolution chain visualisation on detail page
fix: filter empty types from Aether Matrices view
docs: update caching strategy section in README
refactor: extract battle score logic into helper method
```

---

##  License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

##  Acknowledgments

- **[PokéAPI](https://pokeapi.co/)** — Free, open Pokémon data API
- **The Pokémon Company** — Original franchise and artwork
- **Angular Team** — Framework and tooling
- **Tailwind CSS** — Utility-first CSS framework
- **Netlify** — Deployment and hosting platform

---

<div align="center">

 Star this repo if you find it helpful!

*Built with Angular 19 · Last Updated: February 2026*

</div>
