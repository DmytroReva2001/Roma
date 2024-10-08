import { Component, OnInit } from '@angular/core';
import { CestaService } from '../services/cesta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { PedidosService } from '../services/pedidos.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DirectionsService } from '../services/directions.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'], // Corrige `styleUrl` a `styleUrls`
})
export class CompraComponent implements OnInit {
  cestProducts: any[] = [];
  total: number = 0;
  directions: any[] = [];

  constructor(
    private cestaService: CestaService,
    private router: Router,
    private location: Location,
    private pedidoService: PedidosService,
    private directionsService: DirectionsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.consultarProductosCesta();
  }

  private consultarProductosCesta() {
    this.total = 0;

    Swal.fire({
      title: 'Cargando...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.cestaService.getCartProducts().subscribe((products) => {
      this.cestProducts = products.map((product) => ({
        ...product,
        selected: true, // Inicialmente seleccionados
      }));

      this.calcularTotal(); // Calcula el total inicial

      this.directionsService.getDirections().subscribe({
        next: (directions) => {
          if (directions && Array.isArray(directions)) {
            const principales = directions.filter((dir) => dir.principal === true);
            const noPrincipales = directions.filter((dir) => dir.principal !== true);
            this.directions = [...principales, ...noPrincipales];
          } else {
            this.directions = [];
          }
        },
        error: (error) => {
          console.error('Error al cargar direcciones:', error);
        },
      });

      Swal.close();
    });
  }

  // Método para calcular el total basado en los productos seleccionados
  calcularTotal() {
    this.total = this.cestProducts
      .filter((product) => product.selected) // Filtra solo los seleccionados
      .reduce((acc, product) => {
        const cantidad = product.cantidadProducto;
        const precio = product.producto.precio;
        return acc + cantidad * precio;
      }, 0);
  }

  // Método para cambiar el estado del checkbox y recalcular el total
  toggleSelection(product: any) {
    product.selected = !product.selected; // Cambia el estado
    this.calcularTotal(); // Recalcula el total
  }

  back() {
    this.location.back();
  }

  compra() {
    const productosSeleccionados = this.cestProducts
      .filter((product) => product.selected) // Filtra solo los seleccionados
      .map((product) => ({
        productoId: product.producto.id,
        cantidad: product.cantidadProducto,
        talla: product.talla,
      }));

    if (productosSeleccionados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona al menos un producto para proceder con la compra.',
        confirmButtonText: 'Aceptar',
      });
      return; // No continuar si no hay productos seleccionados
    }

    this.pedidoService.registrarPedido(this.total).subscribe({
      next: (pedidoNuevo) => {
        this.pedidoService.agregarProductosAlPedido(pedidoNuevo.id, productosSeleccionados).subscribe({
          next: () => {
            const requests = this.cestProducts
              .filter((product) => product.selected)
              .map((product) =>
                this.cestaService.eliminarProducto(product).pipe(
                  catchError((error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Hubo un problema al intentar eliminar el producto de la cesta. Intenta de nuevo más tarde. Código de error: ' + error,
                      confirmButtonText: 'Aceptar',
                    });
                    return of(null);
                  })
                )
              );

            forkJoin(requests).subscribe(() => {
              Swal.fire({
                title: 'Éxito',
                text: '¡Compra efectuada correctamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.cestaService.getCartProducts().subscribe((products) => {
                    this.sharedService.updateCartItems(products);
                  });
                  this.router.navigateByUrl('/mis_pedidos');
                }
              });
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron agregar los productos al pedido. Código de error: ' + error.message,
              confirmButtonText: 'Aceptar',
            });
          },
        });
      },
      error: (error) => {
        let errorMessage = 'No se pudo registrar el pedido.';
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
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}