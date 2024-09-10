import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nuevo-email',
  templateUrl: './nuevo-email.component.html',
  styleUrls: ['./nuevo-email.component.css']
})
export class NuevoEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cambioEmail();
  }

  private cambioEmail() {
    // Obtener el parámetro 'token' y 'newEmail' de los parámetros de consulta (queryParams)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const newEmail = params['newEmail'];

      if (!token) {
        // Redirigir al usuario si no se proporciona un token
        this.router.navigate(['/menu_principal']);
        return;
      }

      // Decodificar el token para obtener el correo electrónico antiguo
      const oldEmail = this.authService.getEmail(token);

      // Verificar si el token ha expirado
      if (!oldEmail) {
        Swal.fire({
          title: 'Error',
          text: 'La solicitud ha caducado. Solicite su recuperación de contraseña nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/auth']);
        });
        return;
      }

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

      // Cambiar el email llamando al servicio
      this.authService.changeEmail(oldEmail, newEmail).subscribe({
        next: (response: any) => {
          Swal.close();

          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: response.message || 'Tu email se actualizó correctamente. Vuelve a iniciar sesión.',
            icon: 'success',
            confirmButtonText: 'Ir al inicio de sesión'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/auth');
            }
          });
        },
        error: (error) => {
          Swal.close();

          const errorMessage = error?.error?.message || 'No se pudo actualizar el email. Inténtalo de nuevo más tarde.';

          // Mostrar mensaje de error
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  }
}