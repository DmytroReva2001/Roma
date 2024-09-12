import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InfoService } from './info.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CestaService {

  private apiUrl = 'cesta';

  constructor(private http: HttpClient, private infoService: InfoService, private jwtHelper: JwtHelperService) { 
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  getCartProducts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams().set('email', email);

    return this.http.get<any[]>(`${this.apiUrl}/get_cart_products`, { params });
  }

  addCartProducto(idProducto: number, cantidad: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams()
      .set('email', email)
      .set('idProducto', idProducto)
      .set('cantidad', cantidad);

    return this.http.get<any[]>(`${this.apiUrl}/add_producto`, { params });
  }

  eliminarProducto(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
        return of({ error: 'Token no encontrado' }); // Devolver un Observable con error
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams()
      .set('email', email)
      .set('idProductoCesta', product.id);

    return this.http.get<any>(`${this.apiUrl}/delete_producto`, { params });
}

modificarProducto(product: any): Observable<any> {
  const params = new HttpParams()
    .set('idProductoCesta', product.id)
    .set('cantidad', product.cantidadProducto);

  return this.http.get<any>(`${this.apiUrl}/modify_producto`, { params });
}
}
