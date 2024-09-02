import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class TatuajeService {
  private apiUrl = 'tatuajes';

  constructor(private http: HttpClient, private infoService: InfoService) {
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  guardarTatuaje(tatuaje: any): Observable<any> {
  // Obtener el token de localStorage
  const token = localStorage.getItem('token');

  // Crear los encabezados HTTP con el token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // Hacer la solicitud POST con los encabezados
  return this.http.post(this.apiUrl, tatuaje, { headers: headers });
  }

  getTatuajes(): Observable<any[]> {
    // Realizar la solicitud HTTP para obtener los tatuajes desde la API
    return this.http.get<any[]>(this.apiUrl);
  }

  // Realizar la solicitud HTTP para obtener los tatuajes desde la API por ID
  getTatuajeById(tatuajeID: string): Observable<any>
  {
    return this.http.get<any>(this.apiUrl+'/'+tatuajeID);
  }

  deleteTatuajeById(tatuajeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${tatuajeId}`, { headers: headers });
  }
}