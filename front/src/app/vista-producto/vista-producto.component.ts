import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CestaService } from '../services/cesta.service';
import { Location } from '@angular/common';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-vista-producto',
  templateUrl: './vista-producto.component.html',
  styleUrls: ['./vista-producto.component.css']
})
export class VistaProductoComponent implements OnInit {
  product!: Producto;

  selectedImage: string = '';
  isAuthenticated: boolean = false;
  cantidad: number = 1;
  isCantidadValida: boolean = true;
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  selectedSize: string = '';


  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private authService: AuthService,
    private cestaService: CestaService,
    private location: Location,
    private router: Router,
    private sharedService: SharedService
  ) {}
  
  ngOnInit(): void {

     // Animación de cargando para que user no se desespere
     Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Sacamos el id de los parametros
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      // Consultamos toda la info sobre el producto
      this.productoService.getProductById(productId).subscribe(product => {
        this.product = product;
        // Seleccionamos la primera imagen por defecto
        this.selectImage(this.product.imagenes[0]);
      });
    }

    this.authService.tokenValidation().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }  

  // Método para seleccionar la imagen principal
  selectImage(image: string): void {
    this.selectedImage = image;
    Swal.close();
  }

  abrirImg() {
    Swal.fire({
      imageUrl: this.selectedImage,
      imageAlt: 'Imagen seleccionada',
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  buy(producto: Producto, cantidad: number, size: string) {

    if (this.isAuthenticated)
    {
      this.cestaService.addCartProducto(producto, cantidad, size).subscribe({
        next: () => {
          this.cestaService.getCartProducts().subscribe(products => {
            this.sharedService.updateCartItems(products);
          });
          this.router.navigateByUrl('/compra');
        },
        error: (err) => {
          // Si ocurre un error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un problema durante la gestión de producto: ${err.message}`,
            showConfirmButton: true
          });
        }
      });
    }
    else
    {
      this.cestaService.addCartProductoInvitado(producto, cantidad, size).subscribe({
        next: () => {
          this.cestaService.getCartProductsInvitado().subscribe(products => {
            this.sharedService.updateCartItems(products);
          });
          
          Swal.fire({
            title: "Se necesita iniciar sesión",
            text: "Para seguir con la compra se necesita que inicie sesión",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iniciar sesión",
            cancelButtonText: "Seguir mirando",
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-warning'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth', '/compra']);
            }
          });
        },
        error: (err) => {
          // Si ocurre un error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un problema durante la gestión de producto: ${err.message}`,
            showConfirmButton: true
          });
        }
      });
    }
  }

  addCesta(producto: Producto, cantidad: number, talla:string): void {

    if (this.isAuthenticated)
    {
      this.cestaService.addCartProducto(producto, cantidad, talla).subscribe({
        next: () => {
          // Actualizamos la cesta
          this.cestaService.getCartProducts().subscribe(products => {
            this.sharedService.updateCartItems(products);
          });
  
          // Si la respuesta es exitosa
          Swal.fire({
            icon: 'success',
            title: '¡Producto añadido!',
            text: 'El producto se ha añadido a la cesta correctamente.',
            showConfirmButton: true,
            confirmButtonText: 'Ir a cesta',
            showCancelButton: true,
            cancelButtonText: 'Seguir comprando',
            // Añade una clase para personalizar los botones si es necesario
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-warning'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario ha hecho clic en 'Ir a cesta'
              this.router.navigateByUrl('/cesta');
            }
          });
        },
        error: (err) => {
          // Si ocurre un error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un problema al añadir el producto: ${err.message}`,
            showConfirmButton: true
          });
        }
      });
    }
    else
    {
      this.cestaService.addCartProductoInvitado(producto, cantidad, talla).subscribe({
        next: () => {
          // Actualizamos la cesta
          this.cestaService.getCartProductsInvitado().subscribe(products => {
            this.sharedService.updateCartItems(products);
          });
  
          // Si la respuesta es exitosa
          Swal.fire({
            icon: 'success',
            title: '¡Producto añadido!',
            text: 'El producto se ha añadido a la cesta correctamente.',
            showConfirmButton: true,
            confirmButtonText: 'Ir a cesta',
            showCancelButton: true,
            cancelButtonText: 'Seguir comprando',
            // Añade una clase para personalizar los botones si es necesario
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-warning'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario ha hecho clic en 'Ir a cesta'
              this.router.navigateByUrl('/cesta');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // El usuario ha hecho clic en 'Seguir comprando' o cerró el modal
              Swal.close();
            }
          });
        },
        error: (err) => {
          // Si ocurre un error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un problema al añadir el producto: ${err.message}`,
            showConfirmButton: true
          });
        }
      });
    }
  }  

  back()
  {
    this.location.back();
  }

  onCantidadChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Comprobar si el valor es un entero positivo
    const isInteger = /^\d+$/.test(value);
    this.isCantidadValida = isInteger && Number(value) > 0;

    if (!this.isCantidadValida) {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  }
  
}