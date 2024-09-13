import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
import Swal from 'sweetalert2';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent implements OnInit {
  pedidos: any[] = [];
  total: number = 0;

  constructor(private pedidoService: PedidosService) {}
  
  ngOnInit(): void {
    this.consultarPedidos();
  }

  consultarPedidos() {
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos) => {
        // Asegurarse de que pedidos sea siempre un array
        this.pedidos = pedidos || [];
        
        if (this.pedidos.length > 0) {
          this.consultarProductosPedidos();
        } else {
          Swal.close();  // Cerrar el modal si no hay pedidos
        }
      },
      error: () => {
        Swal.close(); 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos. Intente de nuevo más tarde.'
        });
      }
    });
  }

  consultarProductosPedidos() {
    if (!this.pedidos || this.pedidos.length === 0) return;

    const requests = this.pedidos.map(pedido => 
      this.pedidoService.consultarProductosPedido(pedido).pipe(
        tap(productos => {
          pedido.productos = productos;
        })
      )
    );
  
    Swal.fire({
      title: 'Cargando productos...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    forkJoin(requests).subscribe({
      next: () => {
        Swal.close();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al cargar los productos de los pedidos.',
          showConfirmButton: true
        });
      }
    });
  }
}