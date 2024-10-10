import { Component, OnInit } from '@angular/core';
import { CestaService } from '../services/cesta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { PedidosService } from '../services/pedidos.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DirectionsService } from '../services/directions.service';
import { SharedService } from '../services/shared.service';
import { PaymentService } from '../services/payment.service';

declare var Stripe: any;

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent implements OnInit {
  cestProducts: any[] = [];
  total: number = 0;
  directions: any[] = [];
  card: any;
  stripe = Stripe('pk_test_51Q8I23KH4BxtGJtmiMGvYt02sn77uwOsdcJn3jV4ZZmK0xvepfXmxKBzLuT1fXFl4zojELKSGlJuDB489BEUj2Ug00npjk3k9g');

  constructor(
    private cestaService: CestaService,
    private router: Router,
    private location: Location,
    private pedidoService: PedidosService,
    private directionsService: DirectionsService,
    private sharedService: SharedService,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    //this.consultarProductosCesta();
    this.mostrarFormularioPago();
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
        selected: true,
      }));

      this.calcularTotal();

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

  calcularTotal() {
    this.total = this.cestProducts
      .filter((product) => product.selected)
      .reduce((acc, product) => {
        const cantidad = product.cantidadProducto;
        const precio = product.producto.precio;
        return acc + cantidad * precio;
      }, 0);
  }

  toggleSelection(product: any) {
    product.selected = !product.selected;
    this.calcularTotal();
  }

  back() {
    this.location.back();
  }

  compra() {
    const productosSeleccionados = this.cestProducts
      .filter((product) => product.selected)
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
      return;
    }

    this.finalizarPedido(productosSeleccionados);
  }

  finalizarPedido(productosSeleccionados: any) {
    this.paymentService.checkExistingPaymentOption().subscribe({
      next: (response) => {
        if (response.tieneMetodoDePago !== undefined && response.tieneMetodoDePago) {
          this.paymentService.paymentExecute(productosSeleccionados, this.total).subscribe({
            next: () => {
              Swal.fire('Éxito', 'Pago procesado correctamente', 'success').then(() => {
                this.router.navigateByUrl('/mis_pedidos');
              });
            },
            error: (err) => {
              console.error('Error procesando el pago:', err);
              Swal.fire('Error', 'Hubo un problema procesando el pago. Inténtalo de nuevo más tarde.', 'error');
            }
          });
        } else {
          this.mostrarFormularioPago();
        }
      },
      error: (error) => {
        console.error('Error verificando el método de pago:', error);
        Swal.fire('Error', 'Hubo un problema verificando el método de pago. Inténtalo de nuevo más tarde.', 'error');
      }
    });
  }

  registrarPedido(productosSeleccionados: any) {
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

  async mostrarFormularioPago() {
    const { value: formValues } = await Swal.fire({
      title: 'Método de Pago',
      html: `
        <div id="card-element"></div>
        <div id="card-errors" role="alert" style="color: red;"></div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          // Obtener el token de Stripe
          this.stripe.createToken(this.card).then((result: any) => {
            if (result.error) {
              // Mostrar el error en el diálogo
              const errorElement = document.getElementById('card-errors');
              if (errorElement) {
                errorElement.textContent = result.error.message;
              }
              reject(result.error.message); // Rechaza la promesa en caso de error
            } else {
              // Resolviendo el token para su uso posterior
              resolve(result.token.id);
            }
          }).catch((error: any) => {
            reject('Error al crear el token: ' + error.message); // Manejo de errores en la creación del token
          });
        });
      },
      didOpen: () => {
        const elements = this.stripe.elements();
        this.card = elements.create('card');
        this.card.mount('#card-element');
  
        this.card.on('change', (event: any) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            displayError.textContent = event.error ? event.error.message : '';
          }
        });
      },
    });
  
    // Asegúrate de manejar el caso donde no hay error
    if (formValues) {
      this.handlePayment(formValues);
    }
  }
  
  handlePayment(token: string) {
    // Lógica para manejar el pago
    this.paymentService.paymentExecute(token, this.total).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Pago procesado correctamente', 'success').then(() => {
          this.router.navigateByUrl('/mis_pedidos');
        });
      },
      error: (err) => {
        console.error('Error procesando el pago:', err);
        Swal.fire('Error', 'Hubo un problema procesando el pago. Inténtalo de nuevo más tarde.', 'error');
      }
    });
  }
  
}