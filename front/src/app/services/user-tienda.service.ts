// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class UserTiendaService {

  private apiUrl = 'user_tienda';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private infoService: InfoService) { 
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  getUserName(): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(''); // Si no hay token, devuelve un Observable con una cadena vacía
    }

    const email = this.jwtHelper.decodeToken(token).sub;
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/get_user`, {params}).pipe(
      map(user => user.nombre)
    );
  }

  activateUser(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/activate`, { params });
  }
}