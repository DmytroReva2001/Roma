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
  cestProducts: Producto[] = [];

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

    // Obtener los productos del servicio al inicializar el componente
    this.cestaService.getCartProducts().subscribe(products => {
      this.cestProducts = products;
    });
  }

  // Dirigimos al user a otra pantalla con producto pasado por parámetro
  verMas(product: Producto): void {
      this.router.navigate(['/vista_producto', product.id]);
  }
}