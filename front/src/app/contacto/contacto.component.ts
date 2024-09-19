import { Component } from '@angular/core';
import { InfoService } from '../services/info.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'] // Use styleUrls instead of styleUrl
})
export class ContactoComponent {
  // Variable para albergar información a mostrar en HTML
  informacion: any = {};
  
  constructor(
    private infoService: InfoService,
  ) {
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Suscribimos al response de servicio
    this.infoService.getInformacion().subscribe({
      next: (datos) => {
        datos.forEach(item => {
          this.informacion[item.dato] = item.valor;
        });
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      },
      complete: () => {
        Swal.close();
      }
    });
  }
}