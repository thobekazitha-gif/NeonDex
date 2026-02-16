# NeonDex - Pokémon Explorer Application

A modern, cyberpunk-themed Pokémon exploration web application built with Angular 19 and powered by PokéAPI.

## Overview

NeonDex is a single-page application that provides an interactive interface for browsing, searching, and managing favorite Pokémon. The application features a distinctive neon-cyberpunk aesthetic with glass morphism effects, gradient backgrounds, and glowing UI elements.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Architecture](#architecture)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Styling](#styling)
- [The Neural Link Feature](#the-neural-link-feature)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality

- **Pokemon Browsing**: Paginated list view with responsive grid layout displaying Pokémon cards
- **Search and Filter**: Search Pokémon by name, type, or abilities
- **Detailed View**: Comprehensive Pokémon information including stats, types, abilities, and physical characteristics
- **Favorites Management**: Add, remove, and organize favorite Pokémon with persistent storage
- **Type and Ability Explorer**: Dedicated pages for exploring Pokémon types and abilities
- **Neural Link**: Random Pokémon discovery feature with cyberpunk theming

### Advanced Features

- **Computed Statistics**: 
  - Strongest stat highlighting
  - Total Base Stats calculation
  - Power rating classification
  - Type-based grouping

- **Multiple Sorting Options**:
  - Sort by date added
  - Sort alphabetically by name
  - Sort by Pokédex number

- **Responsive Design**: Fully responsive interface adapting to mobile, tablet, and desktop screens

- **Persistent Storage**: Favorites stored in browser LocalStorage for persistence across sessions

## Technologies

### Frontend Stack

- **Framework**: Angular 19
- **Language**: TypeScript 5.x
- **Reactive Programming**: RxJS 7.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Angular Signals
- **Routing**: Angular Router

### Backend

- **Server**: Express.js 4.x (Static file server)
- **Runtime**: Node.js 18+

### External APIs

- **PokéAPI**: https://pokeapi.co/api/v2/

## Prerequisites

Before installing NeonDex, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: For cloning the repository
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Installation

Follow these steps to install and set up NeonDex:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd NeonDex
```

### Step 2: Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

This installs all required Angular packages, Tailwind CSS, and development tools.

### Step 3: Install Backend Dependencies

Navigate to the backend directory and install Express:

```bash
cd ../backend
npm install
```

### Step 4: Build the Frontend Application

Return to the frontend directory and build the production-ready application:

```bash
cd ../frontend
npm run build
```

This creates optimized files in the `dist/` directory.

## Running the Application

### Production Mode

Start the Express server to serve the built application:

```bash
cd backend
node server.js
```

The application will be available at `http://localhost:3000`

### Development Mode

For development with hot-reload and debugging:

```bash
cd frontend
npm start
```

The development server will start at `http://localhost:4200` with automatic reloading on file changes.

## Project Structure

```
NeonDex/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── pokemon-list/          # Main list view
│   │   │   │   ├── pokemon-detail/        # Detail page
│   │   │   │   ├── pokemon-card/          # Reusable card component
│   │   │   │   ├── favorites/             # Favorites page
│   │   │   │   ├── favorite-button/       # Favorite toggle button
│   │   │   │   ├── navbar/                # Navigation component
│   │   │   │   ├── loading-spinner/       # Loading indicator
│   │   │   │   ├── error-message/         # Error display
│   │   │   │   ├── types/                 # Types explorer
│   │   │   │   └── abilities/             # Abilities explorer
│   │   │   ├── services/
│   │   │   │   ├── pokemon.service.ts     # API communication
│   │   │   │   └── favorites.service.ts   # Favorites management
│   │   │   ├── app.component.ts           # Root component
│   │   │   └── app.routes.ts              # Route configuration
│   │   ├── styles.css                     # Global styles
│   │   └── index.html                     # HTML entry point
│   ├── angular.json                       # Angular configuration
│   ├── package.json                       # Frontend dependencies
│   ├── tailwind.config.js                 # Tailwind configuration
│   └── tsconfig.json                      # TypeScript configuration
├── backend/
│   ├── server.js                          # Express server
│   └── package.json                       # Backend dependencies
└── README.md                              # This file
```

## API Integration

NeonDex integrates with PokéAPI, a free RESTful API providing comprehensive Pokémon data.

### Endpoints Used

#### Get Pokémon List
```
GET https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}
```
Returns paginated list of Pokémon

#### Get Pokémon Details
```
GET https://pokeapi.co/api/v2/pokemon/{id or name}
```
Returns complete information about a specific Pokémon

#### Get Type Information
```
GET https://pokeapi.co/api/v2/type/{id or name}
```
Returns information about a Pokémon type

#### Get Ability Information
```
GET https://pokeapi.co/api/v2/ability/{id or name}
```
Returns information about a Pokémon ability

### No Backend Database Required

NeonDex does not require a database or custom backend API. All data is fetched directly from PokéAPI in real-time. The Express server only serves the compiled Angular application as static files.

## Architecture

### Component Architecture

NeonDex follows Angular's component-based architecture with standalone components:

- **Smart Components**: Handle business logic and state management (e.g., pokemon-list, favorites)
- **Presentational Components**: Focus on UI rendering (e.g., pokemon-card, favorite-button)
- **Service Layer**: Manages data fetching and state (pokemon.service, favorites.service)

### Reactive Programming

The application uses two reactive patterns:

1. **RxJS Observables**: For asynchronous API calls and HTTP communication
2. **Angular Signals**: For local state management and derived computations

### Routing

Angular Router manages navigation between views:

- `/` - Pokémon list (home page)
- `/pokemon/:name` - Pokémon detail page
- `/favorites` - Favorites collection
- `/types` - Type explorer
- `/abilities` - Ability explorer

## Key Components

### PokemonListComponent

Main view displaying paginated Pokémon cards with search and filter capabilities.

Features:
- Grid layout with responsive columns
- Pagination controls
- Loading states
- Error handling

### PokemonDetailComponent

Detailed view for individual Pokémon showing:
- High-resolution artwork
- Complete statistics with visual bars
- Strongest stat highlighting
- Power rating classification
- Type and ability information
- Favorite toggle button

### FavoritesComponent

Dedicated page for managing favorite Pokémon:
- Multiple sorting options
- Type-based grouping
- Remove individual items
- Clear all functionality
- Empty state messaging

### FavoriteButtonComponent

Reusable component for toggling favorite status:
- Heart icon with filled/outline states
- Click animation
- Prevents navigation when clicked on cards

### NavbarComponent

Sticky navigation bar featuring:
- Logo with hover effects
- Navigation links (Browse, Types, Abilities, Favorites)
- Favorites count badge
- Responsive layout

## State Management

### Signals-Based Reactivity

NeonDex uses Angular Signals for efficient reactive state management:

```typescript
// Example from FavoritesService
private favoritesSignal = signal<FavoritePokemon[]>([]);
favorites = computed(() => this.favoritesSignal());
favoritesCount = computed(() => this.favoritesSignal().length);
```

Benefits:
- Fine-grained reactivity
- Automatic dependency tracking
- No manual subscription management
- Better performance than observables for local state

### LocalStorage Persistence

Favorites are persisted using browser LocalStorage:
- Automatic save on changes
- Load on application start
- Survives browser refresh
- No backend required

## Styling

### Tailwind CSS

The application uses Tailwind CSS for utility-first styling:
- Responsive breakpoints
- Custom color palette
- Utility classes for rapid development
- JIT (Just-In-Time) compilation

### Custom Styles

Additional custom CSS for:
- Glass morphism effects
- Neon glow animations
- Gradient backgrounds
- Smooth transitions

### Color Scheme

The cyberpunk theme uses:
- Primary: Fuchsia (#d946ef) and Purple (#a855f7)
- Accent: Cyan (#22d3ee) and Pink (#ec4899)
- Background: Dark slate (#0f172a, #1e293b)
- Text: White (#ffffff) and light slate (#cbd5e1)

### Design Patterns

- Glass morphism with backdrop blur
- Neon glow shadows
- Gradient overlays
- Type-specific color coding
- Hover state animations

## The Neural Link Feature

The Neural Link is a thematic feature providing random Pokémon discovery.

### Purpose

Creates an immersive exploration experience aligned with the cyberpunk aesthetic.

### Implementation

```typescript
neuralLink(): void {
  const randomId = Math.floor(Math.random() * 800) + 1;
  this.router.navigate(['/pokemon', randomId]);
}
```

### User Experience

- Accessible from navigation or dedicated button
- Simulates "connecting" to random Pokémon
- Uses cyberpunk-themed terminology
- Provides element of surprise and discovery

## Browser Support

NeonDex supports modern browsers with ES2015+ capabilities:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

Note: Internet Explorer is not supported.

## Development

### Available Scripts

Frontend:
```bash
npm start          # Development server with hot reload
npm run build      # Production build
npm run test       # Run unit tests
npm run lint       # Run ESLint
```

Backend:
```bash
node server.js     # Start Express server
```

### Code Standards

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- Angular style guide compliance

### Testing

The application structure supports:
- Unit tests with Jasmine/Karma
- Integration tests
- E2E tests with Cypress or Playwright

## Computed Features

NeonDex implements several computed features as required:

1. **Strongest Stat Highlighting**: Automatically identifies and highlights the highest base stat for each Pokémon
2. **Total Base Stats (BST)**: Calculates sum of all stats for power comparison
3. **Power Rating Classification**: Categorizes Pokémon as Basic, Standard, Advanced, Elite, or Legendary based on BST
4. **Type Grouping**: Groups favorite Pokémon by type for easy browsing

## Dependencies

### Frontend Dependencies

```json
{
  "@angular/animations": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/compiler": "^19.0.0",
  "@angular/core": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/platform-browser": "^19.0.0",
  "@angular/platform-browser-dynamic": "^19.0.0",
  "@angular/router": "^19.0.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.6.0",
  "zone.js": "^0.14.0"
}
```

### Development Dependencies

```json
{
  "@angular-devkit/build-angular": "^19.0.0",
  "@angular/cli": "^19.0.0",
  "@angular/compiler-cli": "^19.0.0",
  "typescript": "~5.6.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

### Backend Dependencies

```json
{
  "express": "^4.18.0"
}
```

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 node server.js
```

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Clear Angular cache
rm -rf .angular/cache
npm run build
```

**Favorites Not Persisting**
- Check browser LocalStorage is enabled
- Clear browser cache and try again
- Verify no browser extensions blocking storage

## Future Enhancements

Planned features for future releases:

- Advanced search with multiple filters
- Pokemon comparison tool
- Team builder with type coverage analysis
- Evolution chain visualization
- Move set information
- Offline support with Service Workers
- Progressive Web App capabilities
- Multi-language support
- Export/import favorites
- Dark/light mode toggle

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit changes with descriptive messages
4. Push to your fork
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Acknowledgments

- PokéAPI for providing free Pokémon data
- Angular team for the framework
- Tailwind CSS for the styling system
- The Pokémon Company for the original content

## Contact

For questions, issues, or suggestions, please open an issue on the GitHub repository.

---

Built with Angular 19 and passion for Pokémon.

Last Updated: February 10, 2026
