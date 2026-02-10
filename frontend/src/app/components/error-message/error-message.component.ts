import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="text-center py-16">
      <p class="text-2xl text-red-400 font-medium bg-black/70 p-8 rounded-2xl border border-red-600/40 inline-block">
        {{ message() }}
      </p>
    </div>
  `
})
export class ErrorMessageComponent {
  message = input.required<string>();
}