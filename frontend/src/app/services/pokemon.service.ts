import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private url = 'http://localhost:3001/api/pokemon';
  constructor(private http: HttpClient) {}

  getList(offset: number = 0): Observable<any> {
    return this.http.get(`${this.url}?offset=${offset}`);
  }

  getDetails(name: string): Observable<any> {
    return this.http.get(`${this.url}/${name}`);
  }
}