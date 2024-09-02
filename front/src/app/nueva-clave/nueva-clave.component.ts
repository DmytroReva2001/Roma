import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nueva-clave',
  templateUrl: './nueva-clave.component.html',
  styleUrls: ['./nueva-clave.component.css']
})
export class NuevaClaveComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Método que se ejecuta al inicializar el componente
    this.restablecerClave();
  }

  private restablecerClave() {
    // Obtener el parámetro 'token' de los parámetros de consulta (queryParams)
    this.route.queryParams.subscribe(params => {
      // Obtener el token de los parámetros
      const token = params['token'];

      if (!token) {
        // Redirigir al usuario si no se proporciona un token
        this.router.navigate(['/menu_principal']);
        return;
      }
      
      // Decodificar el token para obtener la información y capturar el email
      const email = this.authService.getEmail(token)

      // Verificar si el token ha expirado
      if (!email)
      {       
        // Notificar al usuario si el token ha caducado
          Swal.fire({
            title: 'Error',
            text: 'La solicitud ha caducado. Solicite su recuperación de contraseña nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/auth']);
          return;     
      }

      // Mostrar modal para ingresar la nueva contraseña
      Swal.fire({
        title: 'Ingresa tu nueva contraseña',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        showCancelButton:true,
        showLoaderOnConfirm: true,
        preConfirm: async (newPass: string) => {
          // Validar la nueva contraseña con un FormControl
          const passwordControl = new FormControl(newPass, [
            Validators.required, // Validador para campo requerido
            this.authService.passwordValidator // Validador de fortaleza de contraseña
          ]);

          // Obtener el mensaje de error del validador
          const error = passwordControl.hasError('passwordStrength') ? passwordControl.getError('passwordStrength') : null;

          if (error) {
            Swal.showValidationMessage(error);
            return false;
          }

          return newPass;
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          const newPass = result.value;
          
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

          // Cambiar la contraseña llamando al servicio
          this.authService.changePassword(email, newPass).subscribe({
            next: (response: any) => {
              Swal.close();

              // Mostrar mensaje de éxito
              Swal.fire({
                title: '¡Éxito!',
                text: response.message || 'Tu contraseña se restableció correctamente.',
                icon: 'success',
                confirmButtonText: 'Ir al inicio de sesión'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/auth']);
                }
              });
            },
            error: (error) => {
              Swal.close();

              const errorMessage = error?.error?.message || 'No se pudo restablecer la contraseña. Inténtalo de nuevo más tarde.';

              // Mostrar mensaje de error
              Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                this.restablecerClave();
              });
            }
          });
        }
        else
        {
          Swal.close();
          this.router.navigate(['/auth']);
        }
      });
    });
  }
}