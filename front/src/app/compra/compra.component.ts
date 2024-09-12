import { Component } from '@angular/core';
import { CestaService } from '../services/cesta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Producto } from '../models/producto';
import { Location } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent {
  cestProducts: any[] = [];
  total: number = 0;

  constructor(
    private cestaService: CestaService,
    private router: Router,
    private location: Location
    ) {}

  ngOnInit(): void {

    this.consultarProductosCesta();
  }

  private consultarProductosCesta() {
    this.total = 0;
  
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    // Obtener los productos del servicio
    this.cestaService.getCartProducts().subscribe(products => {
      this.cestProducts = products;
  
      // Recorrer la lista de productos y calcular el total
      this.cestProducts.forEach(product => {
        const cantidad = product.cantidadProducto;
        const precio = product.producto.precio;
        this.total += cantidad * precio;
      });
  
      // Cerrar el mensaje de carga después de procesar los productos
      Swal.close();
    });
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

back()
{
  this.location.back();
}

compra() {
  // Crear un array con todas las solicitudes de eliminación
  const requests = this.cestProducts.map(product => 
    this.cestaService.eliminarProducto(product).pipe(
      catchError(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al intentar eliminar el producto de la cesta. Intenta de nuevo más tarde. Código de error: ' + error,
          confirmButtonText: 'Aceptar'
      });
        // Retornar un observable vacío para continuar con el procesamiento
        return of(null);
      })
    )
  );

  // Esperar a que todas las solicitudes se completen
  forkJoin(requests).subscribe(() => {
    Swal.fire({
      title: 'Éxito',
      text: 'Compra efectuada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/mis_pedidos');
      }
    });
  });
}
}