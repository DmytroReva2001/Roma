import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // Centralizando en una variable la URL de la API
  private apiUrl = '/api/';
  private dirInfo = 'payment'

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  // Método para registrar un nuevo usuario
  paymentExecute(data: any, amount: any): Observable<any> {

    // Obtener el token de localStorage (o de donde lo tengas almacenado)
    const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage

    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}${this.dirInfo}`, {data, amount}, { headers: headers });
  }

  checkExistingPaymentOption(): Observable<any> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      return of({}); // Devuelve un observable vacío si no hay token
    }
  
    const email = this.jwtHelper.decodeToken(token).sub;
    const params = new HttpParams().set('email', email);
  
    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    // Llamar a la API para verificar si existe un método de pago
    return this.http.get<any>(`${this.apiUrl}${this.dirInfo}/check-payment-option`, { headers, params });
  }
}
