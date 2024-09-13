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
  
    // Llamar al servicio para obtener los pedidos del usuario
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        // Cerrar el modal de carga cuando se obtienen los pedidos

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
    // Crear un array para almacenar las peticiones
    const requests = this.pedidos.map(pedido => 
      this.pedidoService.consultarProductosPedido(pedido).pipe(
        // Añadir los productos al pedido cuando la petición se complete
        tap(productos => {
          pedido.productos = productos;
        })
      )
    );
  
    // Mostrar un mensaje de carga mientras se realizan las peticiones
    Swal.fire({
      title: 'Cargando productos...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    // Usar forkJoin para esperar a que todas las peticiones terminen
    forkJoin(requests).subscribe({
      next: () => {
        // Cerrar el mensaje de carga cuando todas las peticiones hayan finalizado
        Swal.close();
      },
      error: () => {
        // Manejar errores en caso de fallo
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