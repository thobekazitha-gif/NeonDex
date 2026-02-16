import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  title = 'NeonDex';

  neuralLink(): void {
    const randomId = Math.floor(Math.random() * 800) + 1;
    this.router.navigate(['/pokemon', randomId]);
  }
}

// Export AppComponent as default if needed
export default AppComponent;
