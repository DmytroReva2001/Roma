import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { CestaService } from '../services/cesta.service';
import { SharedService } from '../services/shared.service';

// Validador personalizado para comprobar que las contraseñas coincidan
function passwordMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { 'passwordMismatch': true }
      : null;
  };
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  // Config para hacer switch de formularios
  formMode: 'login' | 'register' = 'login';

  // Variables para el control de formularios
  loginForm: FormGroup;
  registerForm: FormGroup;
  url: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cestaService: CestaService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {

    if(localStorage.getItem('token'))
    {
      this.router.navigateByUrl('/menu_principal');
    }
    
    // Validadores de formularios
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, authService.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required]
    }, {
      validators: passwordMatchValidator()  // Aplicar el validador personalizado al formulario
    });

    const paramUrl = this.route.snapshot.paramMap.get('url');
    
    if (paramUrl)
    {
      this.url = paramUrl;
    }
    else
    {
      this.url = "/menu_principal";
    }
  }

  // Métodos para cambiar la vista de formularios
  switchToLogin() {
    this.formMode = 'login';
    this.registerForm.reset();

  }

  switchToRegister() {
    this.formMode = 'register';
    this.loginForm.reset();

  }

  // Métodos para enviar los formularios de Inicio de sesión y Registro con sus llamadas a los métodos correspondientes
  onSubmitLogin() {
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

    // Comprobar si formulario es valido
    if (this.loginForm.valid) {
      // Llamamos al método que inicia el procedimiento de Inicio de sesión
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // Del response sacamos datos del usuario y dirigimos al user al menú principal con token guardado en localStorage y modificamos estado de user autenticado.
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl(this.url);
          this.authService.updateAuthStatus(true);
          this.clearData();

          this.actualizarCesta();

          // Cerramos la carga
          Swal.close();
        },
        error: (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Se ha producido un error al iniciar sesión",
            text: error.error.message,
          });
          this.clearData();

          // Cerramos la animación
          Swal.close();
        }
      });
    }
  }

  onSubmitRegister() {
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
  
    // Comprobar si formulario es válido
    if (this.registerForm.valid) {
      // Acceder directamente al valor del campo 'email'
      const email = this.registerForm.value.email;

      // Llamamos al método que inicia el procedimiento de Registro
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.switchToLogin();
          Swal.close();
  
          Swal.fire({
            title: "¡Su cuenta ha sido creada exitosamente!",
            text: `Se le ha enviado un correo a ${email}, confirme su cuenta.`,
            icon: "success"
          });
          this.clearData();
        },
        error: (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Se ha producido un error al registrarse",
            text: error.error.message,
          });
          this.clearData();
  
          Swal.close(); // Cerramos la animación
        }
      });
    }
  }

  // Método para limpiar los formularios
  clearData() {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  // Método para iniciar procedimiento de recuperación de contraseña
  restablecerPassword() {
    // Abrimos formulario para consultar el email de user a recuperar la contraseña
    Swal.fire({
      title: 'Escriba su correo electrónico',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Recuperar contraseña',
      cancelButtonText: 'Volver',
      showLoaderOnConfirm: true,
      preConfirm: async (email: string) => {
        // Crear un FormControl para validar el correo electrónico
        const emailControl = new FormControl(email, [Validators.required, Validators.email]);
  
        // Verificar si el correo electrónico es válido
        if (emailControl.invalid) {
          // Mostrar un mensaje de validación y evitar la confirmación
          Swal.showValidationMessage('Por favor, introduzca un correo electrónico válido');
          return false; // Asegúrate de que el modal no se confirme si el correo es inválido
        }
        // Si el correo electrónico es válido, devolverlo para su uso posterior
        return email;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
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
        
        // Obtener el correo electrónico del resultado
        const email = result.value;
        
        // Suscribirse al método del servicio que maneja el inicio de procedimiento de recuperación de contraseña
        this.authService.enviarCorreoPassword(email).subscribe({
          next: (response: any) => {
            Swal.close();

            Swal.fire({
              title: 'Correo electrónico enviado',
              text: `Se le ha enviado un correo electrónico a ${email} para recuperar su contraseña.`,
              icon: 'success'
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: "error",
              title: "Se ha producido un error",
              text: error.error.message,
            });
          }
        });
      }
    });
  }

  togglePasswordVisibility(element:string) {
    const passwordFieldElement = document.getElementById(element) as HTMLInputElement;
  
    if (passwordFieldElement) {
      if (passwordFieldElement.getAttribute('type') === 'password') {
        passwordFieldElement.setAttribute('type', 'text');
      } else {
        passwordFieldElement.setAttribute('type', 'password');
      }
    }
  }

  actualizarCesta() {
    if (localStorage.getItem('romaInvitedSesion'))
    {
      this.cestaService.getCartProductsInvitado().subscribe(productsCestaInvitado => {
        productsCestaInvitado.forEach(product => {
          this.cestaService.addCartProducto(product.producto, product.cantidadProducto, product.talla).subscribe({
            next: () => {
              // Actualizamos la cesta
              this.cestaService.getCartProducts().subscribe(products => {
                this.sharedService.updateCartItems(products);
              });
            },
            error: (err) => {
              // Si ocurre un error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Ocurrió un problema al añadir el producto: ${err.message}`,
                showConfirmButton: true
              });
            }
          });
        });
      });
    }

    localStorage.removeItem('romaInvitedSesion')
  }
}