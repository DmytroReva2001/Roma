import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-vista-producto',
  templateUrl: './vista-producto.component.html',
  styleUrls: ['./vista-producto.component.css']
})
export class VistaProductoComponent implements OnInit {
  product!: Producto;

  selectedImage: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private authService: AuthService,
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

  buy(producto: Producto)
  {
    
  }

  addCesta(producto: Producto)
  {

  }
}