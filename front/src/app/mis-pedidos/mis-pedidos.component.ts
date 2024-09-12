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
  cargando: boolean = false;

  constructor(private pedidoService: PedidosService) {}
  
  ngOnInit(): void {
    this.consultarPedidos();
  }

  consultarPedidos() {
    
    this.cargando = true;

    // Llamar al servicio para obtener los pedidos del usuario
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos. Intente de nuevo más tarde.'
        });
      }
    });
  }
}