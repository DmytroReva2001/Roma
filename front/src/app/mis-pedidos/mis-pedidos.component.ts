import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
import Swal from 'sweetalert2';

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
  
    // Llamar al servicio para obtener los pedidos del usuario
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        Swal.close(); // Cerrar el modal de carga cuando se obtienen los pedidos

        this.consultarProductosPedidos();
      },
      error: () => {
        Swal.close(); // Cerrar el modal también en caso de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos. Intente de nuevo más tarde.'
        });
      }
    });
  }

  consultarProductosPedidos() {
    // Iterar sobre la lista de pedidos
    this.pedidos.forEach(pedido => {
      // Llamar al servicio para obtener los productos de cada pedido
      this.pedidoService.consultarProductosPedido(pedido).subscribe({
        next: (productos) => {
          // Añadir los productos al pedido actual
          pedido.productos = productos; // Aquí añades los productos al pedido
        },
        error: () => {
          console.error(`Error al cargar productos para el pedido con id ${pedido.id}`);
        }
      });
    });
  }
  
}