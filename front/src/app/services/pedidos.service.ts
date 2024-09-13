import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoService } from './info.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'pedidos';

  constructor(private http: HttpClient, private infoService: InfoService, private jwtHelper: JwtHelperService) { 
    this.apiUrl = this.infoService.getAuthUrl()+this.apiUrl;
  }

  getPedidos(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams().set('email', email);

    return this.http.get<any[]>(`${this.apiUrl}/get_pedidos`, { params });
  }

  registrarPedido(total:any): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }
  
    const email = this.jwtHelper.decodeToken(token)?.sub;    
  
    // Crear los encabezados HTTP con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    // Enviar email como cadena de texto
    return this.http.post<any>(
      `${this.apiUrl}/crear_pedido?email=${encodeURIComponent(email)}&total=${total}`, 
      {}, 
      { headers }
    );

  }

  agregarProductosAlPedido(pedidoId: number, productosPedidos: any[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/agregar_productos`, { pedidoId, productosPedidos }, { headers });
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

consultarProductosPedido(pedido: any): Observable<any>
{
  const params = new HttpParams()
  .set('idPedido', pedido.id)

return this.http.get<any>(`${this.apiUrl}/productos_pedido`, { params });
}

}
