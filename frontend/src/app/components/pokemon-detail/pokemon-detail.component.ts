// pokemon-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.fetchDetail(name);
    }
  }

  fetchDetail(name: string) {
    this.loading = true;
    this.http.get<any>(`http://localhost:3000/pokemon/${name}`)
      .subscribe({
        next: (data) => {
          this.pokemon = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to load Pokémon details';
          this.loading = false;
        }
      });
  }

  getStatWidth(base: number): string {
    return `${(base / 255) * 100}%`;
  }
}