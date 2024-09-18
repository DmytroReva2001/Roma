import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private cartItemsSource = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItemsSource.asObservable();

  updateCartItems(products: any[]): void {
    let count = 0;

    if (Array.isArray(products) && products.length > 0) {
        products.forEach(product => {
            if (product.cantidadProducto && typeof product.cantidadProducto === 'number') {
                count += product.cantidadProducto;
            }
        });
    }

    this.cartItemsSource.next(count);
}
}
