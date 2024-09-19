import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DirectionsService } from '../services/directions.service';

@Component({
  selector: 'app-datos-envio',
  templateUrl: './datos-envio.component.html',
  styleUrl: './datos-envio.component.css'
})
export class DatosEnvioComponent implements OnInit {
  directionForm!: FormGroup;
  directions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private directionsService : DirectionsService
  ) {
    this.directionForm = this.fb.group({
      id: [''],
      direccion: ['', [Validators.required]],  // Campo dirección obligatorio
      cp: ['', [Validators.required, Validators.pattern(/^\d+$/)]],  // Campo CP obligatorio y debe ser numérico
      predeterminada: [false, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  private cargarDirecciones() {
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.directionsService.getDirections().subscribe(directions => {
      if (directions && Array.isArray(directions)) {
        // Coloca las direcciones con 'principal = true' al inicio
        const principales = directions.filter(dir => dir.principal === true);
        const noPrincipales = directions.filter(dir => dir.principal !== true);
  
        // Reorganiza la lista con la dirección principal al inicio
        this.directions = [...principales, ...noPrincipales];
      } else {
        this.directions = [];
      }
  
      Swal.close();
    }, error => {
      console.error("Error al cargar direcciones:", error);
      Swal.close();
    });
  }   

  openSwalAddDirection() {
    const form = this.fb.group({
      direccion: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      predeterminada: [false]  // Checkbox para establecer como dirección principal
    });
  
    Swal.fire({
      title: 'Añadir nueva dirección',
      html:
        `<div>
            <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
            <div id="direccionError" class="text-danger"></div>
          </div>
          <div>
            <input type="text" id="cp" class="swal2-input" placeholder="Código Postal">
            <div id="cpError" class="text-danger"></div>
          </div>
          <div class="text-left">
            <input type="checkbox" id="predeterminada" class="mr-2">
            <label for="predeterminada">Establecer como principal</label>
          </div>`,
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const direccion = (document.getElementById('direccion') as HTMLInputElement).value;
        const cp = (document.getElementById('cp') as HTMLInputElement).value;
        const predeterminada = (document.getElementById('predeterminada') as HTMLInputElement).checked;  // Obtener valor del checkbox
  
        // Actualizamos los valores del formulario reactivo
        form.get('direccion')?.setValue(direccion);
        form.get('cp')?.setValue(cp);
        form.get('predeterminada')?.setValue(predeterminada);  // Actualizar valor del checkbox
  
        const errors: string[] = [];
  
        // Validaciones personalizadas
        if (!direccion) {
          errors.push('La dirección es obligatoria.');
        }
  
        if (!cp) {
          errors.push('El Código Postal es obligatorio.');
        } else if (!/^\d+$/.test(cp)) {
          errors.push('El Código Postal debe ser numérico.');
        }
  
        if (errors.length > 0) {
          // Mostramos los mensajes de error
          document.getElementById('direccionError')!.innerHTML = direccion ? '' : 'La dirección es obligatoria.';
          document.getElementById('cpError')!.innerHTML = cp ? (/^\d+$/.test(cp) ? '' : 'El Código Postal debe ser numérico.') : 'El Código Postal es obligatorio.';
          Swal.showValidationMessage('Por favor, corrige los errores antes de continuar.');
          return false; // Prevenir el cierre del Swal si hay errores
        }
  
        // Si todo está correcto, retornamos los valores
        return { direccion, cp, predeterminada };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { direccion, cp, predeterminada } = result.value as { direccion: string, cp: string, predeterminada: boolean };
  
        // Llamar al servicio para añadir la dirección
        this.directionsService.addDirection(direccion, cp, predeterminada).subscribe({
          next: () => {
            Swal.fire('Éxito', 'La dirección ha sido añadida correctamente', 'success');
            this.cargarDirecciones();  // Actualizar la lista de direcciones
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al añadir la dirección', error);
          }
        });
      }
    });
  } 

  modifyDirection(direccion: any)
  {
            // Llamar al servicio para modificar la dirección
            this.directionsService.modifyDirection(direccion).subscribe({
              next: () => {
                Swal.fire('Éxito', 'La dirección ha sido añadida correctamente', 'success');
                this.cargarDirecciones();  // Actualizar la lista de direcciones
              },
              error: (error) => {
                Swal.fire('Error', 'Hubo un problema al añadir la dirección', error);
              }
            });
  }

}