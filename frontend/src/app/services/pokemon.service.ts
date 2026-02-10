import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000';  // Your backend proxy

  constructor(private http: HttpClient) { }

  getPokemonList(limit = 20, offset = 0): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetail(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
  }
}