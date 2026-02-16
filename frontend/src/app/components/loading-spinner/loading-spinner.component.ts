import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-neon-pink border-t-transparent"></div>
    </div>
  `
})
export class LoadingSpinnerComponent { }
