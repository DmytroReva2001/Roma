import { Component } from '@angular/core';
import { TatuajeService } from '../services/tatuaje.service';
import { Tatuaje } from '../models/tatuaje';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-tatuajes',
  templateUrl: './tatuajes.component.html',
  styleUrl: './tatuajes.component.css'
})
export class TatuajesComponent {
  tatuajes!: any[];


  constructor(
    private tatuajeService: TatuajeService,
    private router: Router,
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
    this.tatuajeService.getTatuajes().pipe(
      tap((tatuajes: any[]) => {
        this.tatuajes = tatuajes;
      })
    ).subscribe({
      complete: () => {
        Swal.close();
      }
    });   
  }

  // Método para configurar el desvío de usuario a componente de vista_tatuaje
  verMas(tatuaje: Tatuaje): void {
    if (tatuaje && tatuaje.id) {
      this.router.navigate(['/vista_tatuaje', tatuaje.id]);
    } else {
      console.error('El objeto de producto es nulo o indefinido, o no tiene un ID válido.');
    }
  }
}
