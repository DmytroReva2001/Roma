import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTiendaService } from '../services/user-tienda.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserTiendaService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    // Animación de carga
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Obtener el parámetro 'token' de los parámetros de consulta (queryParams)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (!token) {
        // Redirigir al usuario si no se proporciona un token
        this.router.navigate(['/menu_principal']);
        return;
      }
      
      // Decodificar el token para obtener la información y capturamos email
      const email = this.authService.getEmail(token)

      if (!email) {

        Swal.close();

        // Token caducado, notificar al usuario
        Swal.fire({
            title: 'Error',
            text: 'La solicitud ha caducado. Solicite su activación nuevamente.',
            icon: 'error',
            confirmButtonText: 'Solicitar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return this.authService.reenviarActivacionUser(token).subscribe({
                    next: (response: any) => {
                        // Del response sacamos conclusión de que email ha sido enviado
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Su mensaje de activación de cuenta se ha enviado correctamente.",
                        });
                    },
                    error: (error: any) => {
                        Swal.fire({
                            icon: "error",
                            title: "Se ha producido un inesperado.",
                            text: error.error.message,
                        });
                    }
                });
            }
        }).then((result) => {
            this.router.navigate(['/auth']);
        });
        return;
    }
         
      // Accedemos a método de activación de usuario por su email
      this.userService.activateUser(email).subscribe({
        // Manejamos respuestas
        next: (response: any) => {
          Swal.close();

          // Mostrar un mensaje de éxito con SweetAlert2
          Swal.fire({
            title: '¡Éxito!',
            text: response.message || 'Tu cuenta ha sido activada correctamente.',
            icon: 'success',
            confirmButtonText: 'Ir al login'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirigir al usuario al login si el botón de confirmación es presionado
              this.router.navigate(['/auth']);
            }
          });
        },
        error: (error) => {
          Swal.close();
          
          // Revisar la estructura del error recibido y extraer el mensaje
          const errorMessage = error?.error?.message || 'No se pudo activar la cuenta. Por favor, inténtalo de nuevo más tarde.';

          // Mostrar un mensaje de error con SweetAlert2
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Redirigir al usuario a una página de inicio
            this.router.navigate(['/menu_principal']);
          });
        }
      });
    });
  }
}
