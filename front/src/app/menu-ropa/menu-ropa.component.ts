import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from '../models/producto';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-ropa',
  templateUrl: './menu-ropa.component.html',
  styleUrls: ['./menu-ropa.component.css']
})
export class MenuRopaComponent implements OnInit {
  products: Producto[] = [];
  filterTypes: { name: string, selected: BehaviorSubject<boolean> }[] = [];
  filteredProducts: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.productoService.getProducts().subscribe(products => {
      this.products = products;
      this.route.params.subscribe(params => {
        const tipoProducto = params['tipoProducto'];
        this.initializeFilters();
        if (tipoProducto) {
          this.filterProducts(tipoProducto);
        }
      });
    });
  }

  initializeFilters(): void {
    // Obtener tipos únicos de productos
    const uniqueTypes = this.getUniqueTypes();
    
    // Inicializar filterTypes con tipos únicos
    this.filterTypes = uniqueTypes.map(type => ({
      name: type,
      selected: new BehaviorSubject<boolean>(false)
    }));

    // Inicialmente, mostrar todos los productos
    this.filteredProducts = this.products;
  }

  filterProducts(type: string): void {
    // Marcar el tipo seleccionado y filtrar productos
    this.filterTypes.forEach(filter => filter.selected.next(filter.name === type));
    this.filteredProducts = this.products.filter(product => product.tipoProducto === type);
  }

  getUniqueTypes(): string[] {
    // Obtener tipos únicos de productos

    Swal.close();
    return [...new Set(this.products.map(product => product.tipoProducto))];
  }

  resetFilters(): void {
    // Restablecer los filtros y mostrar todos los productos
    this.filterTypes.forEach(filter => filter.selected.next(false));
    this.filteredProducts = this.products;
  }

  // Dirigimos al user a otra pantalla con producto pasado por parámetro
  verMas(product: Producto): void {
      this.router.navigate(['/vista_producto', product.id]);
  }
}