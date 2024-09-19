import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  private apiUrl = 'direcciones';

  constructor(private http: HttpClient, private infoService: InfoService, private jwtHelper: JwtHelperService) { 
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  getDirections(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams().set('email', email);

    return this.http.get<any[]>(`${this.apiUrl}/get_direcciones`, { params });
  }

  addDirection(direccion: string, cp: string, predeterminada:boolean): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/add_direccion`, {direccion, cp, email, predeterminada }, { headers });
  }

  modifyDirection(direction:any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/modify_direccion`, { direction }, { headers });
  }
}
