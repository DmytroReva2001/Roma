import { Component, OnInit } from '@angular/core';
import { CestaService } from '../services/cesta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { PedidosService } from '../services/pedidos.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit{
  cestProducts: any[] = [];
  total: number = 0;

  constructor(
    private cestaService: CestaService,
    private router: Router,
    private location: Location ,
    private pedidoService: PedidosService
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

back()
{
  this.location.back();
}

compra() {
  // Registrar el pedido en el backend
  this.pedidoService.registrarPedido(this.total).subscribe({
    next: (pedidoNuevo) => {
      // Enviar la lista de productos al pedido creado
      const productosPedidos = this.cestProducts.map(product => ({
        productoId: product.producto.id,  // ID del producto
        cantidad: product.cantidadProducto,  // Cantidad del producto
        idPedido: pedidoNuevo.id, // ID del pedido creado
        talla: product.talla // Talla de producto
      }));

      this.pedidoService.agregarProductosAlPedido(pedidoNuevo.id, productosPedidos).subscribe({
        next: () => {
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
                return of(null); // Continuar aunque haya errores
              })
            )
          );

          // Esperar a que todas las solicitudes de eliminación se completen
          forkJoin(requests).subscribe(() => {
            Swal.fire({
              title: 'Éxito',
              text: '¡Compra efectuada correctamente!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                // Navegar a otra página o realizar otra acción aquí, si es necesario
                this.router.navigateByUrl('/mis_pedidos'); // Opcional, dependiendo de lo que necesites hacer a continuación
              }
            });
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron agregar los productos al pedido. Código de error: ' + error.message,
            confirmButtonText: 'Aceptar'
          });
        }
      });
    },
    error: (error) => {
      let errorMessage = 'No se pudo registrar el pedido.';

      // Verificar si el error tiene un cuerpo con mensaje
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Aceptar'
      });
    }
  });
}

}