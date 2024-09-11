import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InfoService } from './info.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'productos';

  // Construimos URL de Endpoint
  constructor(private http: HttpClient, private infoService: InfoService, private jwtHelper: JwtHelperService) {
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  // Método para enviar el producto con los headers de seguridad
  guardarProducto(producto: any): Observable<any> {
    // Obtener el token de localStorage (o de donde lo tengas almacenado)
    const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage

    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Hacer la solicitud POST con los encabezados
    return this.http.post(this.apiUrl, producto, { headers: headers });
  }

  getProducts(): Observable<any[]> {
    // Realizar la solicitud HTTP para obtener los productos desde la API
    return this.http.get<any[]>(this.apiUrl);
  }

  // Realizar la solicitud HTTP para obtener los productos desde la API solamente por la ID de producto
  getProductById(productId: string): Observable<any>
  {
    return this.http.get<any>(this.apiUrl+'/'+productId);
  }

  deleteProductById(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers: headers });
  }
}