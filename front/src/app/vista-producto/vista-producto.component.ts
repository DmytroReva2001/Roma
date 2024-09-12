import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CestaService } from '../services/cesta.service';
import { Location } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private authService: AuthService,
    private cestaService: CestaService,
    private location: Location,
    private router: Router
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

  buy(producto: Producto, cantidad: number)
  {
    this.cestaService.addCartProducto(producto.id!, cantidad).subscribe({
      next: () => {
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

  addCesta(producto: Producto, cantidad: number): void {
    this.cestaService.addCartProducto(producto.id!, cantidad).subscribe({
      next: () => {
        // Si la respuesta es exitosa
        Swal.fire({
          icon: 'success',
          title: '¡Producto añadido!',
          text: 'El producto se ha añadido a la cesta correctamente.',
          timer: 2000,
          showConfirmButton: false
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

  back()
  {
    this.location.back();
  }
  
}