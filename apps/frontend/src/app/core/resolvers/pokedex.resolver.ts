import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../../../prisma-types';

@Injectable({ providedIn: 'root' })
export class PokedexResolver implements Resolve<any> {
  constructor(private http: HttpClient) {}

  resolve(): Observable<any> {
    return this.http.get<Pokemon[]>(`${environment.backendURL}/pokemon`);
  }
}
