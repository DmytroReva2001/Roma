// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InfoService } from './info.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserTiendaService {

  private apiUrl = 'user_tienda';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private infoService: InfoService) { 
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  getUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({} as User);
    }
  
    const email = this.jwtHelper.decodeToken(token).sub;
    const params = new HttpParams().set('email', email);
    return this.http.get<User>(`${this.apiUrl}/get_user`, { params });
  }

  getUserEmail(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({} as User);
    }
  
    return this.jwtHelper.decodeToken(token).sub;
  }

  activateUser(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/activate`, { params });
  }

  // Método para actualizar a un usuario
  updateUserData(updateData: any): Observable<any> {

    const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage

    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/update_user_data`, updateData, { headers: headers });
  }
}