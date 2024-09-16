import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import { CestaService } from '../services/cesta.service';

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent {
  cestProducts: any[] = [];

  constructor(
    private cestaService: CestaService,
    private router: Router  ) {}

  ngOnInit(): void {

    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.consultarProductosCesta();
  }

  private consultarProductosCesta() {
    
    // Obtener los productos del servicio al inicializar el componente
    this.cestaService.getCartProducts().subscribe(products => {
      this.cestProducts = products;
    });

    Swal.close();
  }

  // Dirigimos al user a otra pantalla con producto pasado por parámetro
  verMas(product: Producto): void {
      this.router.navigate(['/vista_producto', product.id]);
  }

  // Incrementar cantidad
incrementQuantity(product: any) {
  product.cantidadProducto++;

  this.modifyProduct(product);
}

// Decrementar cantidad
decrementQuantity(product: any) {
  if (product.cantidadProducto >= 1) {
    product.cantidadProducto--;

    this.modifyProduct(product);
  }

  if (product.cantidadProducto === 0)
  {
    this.removeProduct(product);
  }
}

// Modificar producto
modifyProduct(product: any) {
  this.cestaService.modificarProducto(product).subscribe({
    next: () => {
      this.consultarProductosCesta();
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al intentar eliminar el producto de la cesta. Intenta de nuevo más tarde. Código de error: ' + error.message,
        confirmButtonText: 'Aceptar'
      });
    }
  });
}

onQuantityChange(product: any) {

  if(!product.cantidadProducto)
  {
    product.cantidadProducto = 1;
    this.modifyProduct(product);

  }
  if (product.cantidadProducto === 0 )
  {
    this.removeProduct(product);
  }
  else
  {
    this.modifyProduct(product);
  }
}


// Eliminar producto
removeProduct(product: any) {
  this.cestaService.eliminarProducto(product).subscribe({
    next: () => {
      this.consultarProductosCesta();
      // Actualiza la vista o estado local aquí si es necesario
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al intentar eliminar el producto de la cesta. Intenta de nuevo más tarde. Código de error: ' + error,
        confirmButtonText: 'Aceptar'
      });
    }
  });
}
}