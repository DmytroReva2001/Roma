import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InfoService {

  // Centralizando en una variable la URL de la API
  private apiUrl = '/api/';
  private dirInfo = 'informacion'

  constructor(private http: HttpClient) { }

  getInformacion(): Observable<any[]> {
    // Realizar la solicitud HTTP para obtener los productos desde la API
    return this.http.get<any[]>(`${this.apiUrl}${this.dirInfo}`);
  }

  getAuthUrl(): string {
    return `${this.apiUrl}`; // Ejemplo de método para obtener la URL de autenticación
  }

  getInfoById(infoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.dirInfo}/${infoId}`);
  }

  // Método para registrar un nuevo usuario
  altaInfo(data: any): Observable<any> {

    // Obtener el token de localStorage (o de donde lo tengas almacenado)
    const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage

    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}${this.dirInfo}`, data, { headers: headers });
  }

  deleteInfoById(infoId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}${this.dirInfo}/${infoId}`, { headers: headers });
  }
}