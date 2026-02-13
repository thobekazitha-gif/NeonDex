import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000';  // Your backend proxy

  constructor(private http: HttpClient) { }

  // FIXED: Changed parameter order to match how it's called
  getPokemonList(offset = 0, limit = 20): Observable<any> {
    console.log('Fetching Pokemon with offset:', offset, 'limit:', limit); // Debug
    return this.http.get<any>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetail(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
  }
}
