import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InfoService } from './info.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Producto } from '../models/producto';

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

  getCartProductsInvitado(): Observable<any[]> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('romaInvitedSesion');

    // Si el token no existe, devolver un Observable de array vacío
    if (!token) {
      return of([]);
    }

    // Intentar parsear el token y obtener los productos
    let products: any[] = [];
    
    try {
      products = JSON.parse(token);
    } catch (error) {
      // En caso de error en el parseo, devolver un array vacío
      console.error('Error parsing cart token:', error);
      return of([]);
    }

    // Devolver la lista de productos como un Observable
    return of(products);
  }

  addCartProducto(producto: Producto, cantidad: number, size:string): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Devolver un Observable de array vacío
    }

    const email = this.jwtHelper.decodeToken(token)?.sub; // Asegúrate de que la propiedad sub está presente
    const params = new HttpParams()
      .set('email', email)
      .set('idProducto', producto.id!)
      .set('cantidad', cantidad)
      .set('talla', size);

    return this.http.get<any[]>(`${this.apiUrl}/add_producto`, { params });
  }

  addCartProductoInvitado(producto: Producto, cantidad: number, size: string): Observable<any[]> {
    // Obtener el token del localStorage
    let token = localStorage.getItem('romaInvitedSesion');

    // Si el token no existe, crear uno nuevo
    let cart: any[] = [];
    if (token) {
      cart = JSON.parse(token);
    }

    // Crear el objeto del producto a añadir
    const cartProduct = {
      producto: producto,
      cantidadProducto: cantidad,
      talla: size
    };

    // Añadir el nuevo producto al carrito
    cart.push(cartProduct);

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('romaInvitedSesion', JSON.stringify(cart));

    // Devolver el carrito actualizado como respuesta
    return of(cart); // Utilizamos `of` para devolver un Observable con el carrito actualizado
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

eliminarProductoCestaInvitado(product: any): Observable<any> {
  // Obtener el token del localStorage
  const token = localStorage.getItem('romaInvitedSesion');

  // Si el token no existe, devolver un Observable con un mensaje de error
  if (!token) {
    return of({ error: 'Token no encontrado' });
  }

  let cart: any[] = [];
  try {
    cart = JSON.parse(token); // Intentar parsear el token
  } catch (error) {
    return of({ error: 'Error en el parseo del token' });
  }

  // Buscar el índice del producto a eliminar
  const productIndex = cart.findIndex(p => p.idProducto === product.id);

  // Si el producto no se encuentra en el carrito, devolver un Observable con un mensaje de error
  if (productIndex === -1) {
    return of({ error: 'Producto no encontrado en el carrito' });
  }

  // Eliminar el producto del carrito
  cart.splice(productIndex, 1);

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem('romaInvitedSesion', JSON.stringify(cart));

  // Devolver el carrito actualizado como respuesta
  return of(cart);
}

modificarProducto(product: any): Observable<any> {
  const params = new HttpParams()
    .set('idProductoCesta', product.id)
    .set('cantidad', product.cantidadProducto);

  return this.http.get<any>(`${this.apiUrl}/modify_producto`, { params });
}

modificarProductoCestaInvitado(product: any): Observable<any> {
  // Obtener el token del localStorage
  const token = localStorage.getItem('romaInvitedSesion');

  // Si el token no existe, devolver un Observable con un mensaje de error
  if (!token) {
    return of({ error: 'Token no encontrado' });
  }

  let cart: any[] = [];
  try {
    cart = JSON.parse(token); // Intentar parsear el token
  } catch (error) {
    return of({ error: 'Error en el parseo del token' });
  }

  // Buscar el producto en el carrito
  const productIndex = cart.findIndex(p => p.producto.id === product.producto.id);
  if (productIndex === -1) {
    return of({ error: 'Producto no encontrado en el carrito' });
  }

  // Actualizar la cantidad del producto
  cart[productIndex].cantidadProducto = product.cantidadProducto;

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem('romaInvitedSesion', JSON.stringify(cart));

  // Devolver el carrito actualizado como respuesta
  return of(cart);
}
}
