import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserTiendaService } from '../services/user-tienda.service';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user!: User;
  updateForm!: FormGroup;
  initialFormValue: any;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userTiendaService: UserTiendaService,
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private router: Router,
  ) {
    this.updateForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      imagen: [null],
    });
  }

  ngOnInit(): void {
    this.cargarUser();
  }

  private cargarUser() {

    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.userTiendaService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.updateForm.patchValue({
          id: user.id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          telefono: user.telefono,
          email: user.email,
          imagen: user.imagen
        });
  
        // Guardamos el estado inicial del formulario
        this.initialFormValue = this.updateForm.getRawValue();

        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching user', error);

        Swal.close();
      }
    });
  }

  onSubmitUpdate() {
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.updateForm.valid) {
      this.userTiendaService.updateUserData(this.updateForm.value).subscribe({
        next: () => {
          Swal.close();
          
          Swal.fire({
            title: "¡Éxito!",
            text: "Datos actualizados correctamente",
            icon: "success"
          }).then(() => {
            location.reload();
          });
        },
        error: (error: any) => {
          Swal.close();

          Swal.fire({
            icon: "error",
            title: "Se ha producido un error al actualizar",
            text: error.error,
          }).then(() => {
            location.reload();
          });
        }
      });
    }
  }

  back() {
    this.location.back();
  }

pickImg() {
  this.fileInput.nativeElement.click();
}

handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.user.imagen = reader.result as string;
      this.updateForm.patchValue({ imagen: this.user.imagen });
    };

    reader.readAsDataURL(file);
  }
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

  changePassword() {
    const email = this.updateForm.value.email;
  
    const form = this.fb.group({
      oldPass: ['', Validators.required],
      newPass1: ['', [Validators.required, this.authService.passwordValidator]],
      newPass2: ['', [Validators.required]]
    });
  
    Swal.fire({
      title: 'Cambio de contraseña',
      html:
        `<div class="password">
          <input placeholder="Contraseña actual" type="password" id="oldPass" class="swal2-input">
          <button type="button" id="toggleOldPass" class="toggle-password">
          <img src="https://cdn-icons-png.flaticon.com/512/6405/6405909.png">
          </button>
        </div>

        <hr>

        <div class="password">
          <input type="password" id="newPass1" class="swal2-input" placeholder="Nueva contraseña">
          <button type="button" id="toggleNewPass1" class="toggle-password"><img src="https://cdn-icons-png.flaticon.com/512/6405/6405909.png"></button>
        </div>

        <div class="password">
          <input type="password" id="newPass2" class="swal2-input" placeholder="Repita la contraseña">
          <button type="button" id="toggleNewPass2" class="toggle-password"><img src="https://cdn-icons-png.flaticon.com/512/6405/6405909.png"></button>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'Cambiar contraseña',
      cancelButtonText: 'Volver',
      didOpen: () => {
        const togglePasswordVisibility = (elementId: string) => {
          const input = document.getElementById(elementId) as HTMLInputElement;
          if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
          }
        };
  
        document.getElementById('toggleOldPass')?.addEventListener('click', () => togglePasswordVisibility('oldPass'));
        document.getElementById('toggleNewPass1')?.addEventListener('click', () => togglePasswordVisibility('newPass1'));
        document.getElementById('toggleNewPass2')?.addEventListener('click', () => togglePasswordVisibility('newPass2'));
      },
      preConfirm: () => {
        const oldPass = (document.getElementById('oldPass') as HTMLInputElement).value;
        const newPass1 = (document.getElementById('newPass1') as HTMLInputElement).value;
        const newPass2 = (document.getElementById('newPass2') as HTMLInputElement).value;
  
        form.get('oldPass')?.setValue(oldPass);
        form.get('newPass1')?.setValue(newPass1);
        form.get('newPass2')?.setValue(newPass2);
  
        const errors = [];
  
        if (newPass1 !== newPass2) {
          errors.push('<br>Las contraseñas no coinciden.<br>');
        }
  
        if (oldPass === newPass1) {
          errors.push('<br>La nueva contraseña no puede ser igual a la contraseña actual.<br>');
        }
  
        if (form.invalid) {
          errors.push(
            '<br>Por favor, introduzca una contraseña válida que cumpla con los siguientes requisitos:<br><br>' +
              '- Al menos 6 caracteres.<br>' +
              '- Al menos una letra mayúscula.<br>' +
              '- Al menos una letra minúscula.<br>' +
              '- Al menos un número.<br>' +
              '- Al menos un carácter especial (ej. @, #, $, %).'
          );
        }
  
        if (errors.length > 0) {
          Swal.showValidationMessage(errors.join('<br>'));
          return false;
        }
  
        return { oldPass, newPass1 };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const { oldPass, newPass1 } = result.value;
  
        Swal.fire({
          title: "Cargando...",
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        this.authService.changeAccountPassword(email, oldPass, newPass1).subscribe({
          next: (response: any) => {
            Swal.close();
            Swal.fire({
              title: '¡Éxito!',
              text: response.message || 'Tu contraseña se ha cambiado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              localStorage.removeItem('token');
              this.router.navigate(['/auth']);
            });
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: error?.error?.message || 'No se pudo cambiar la contraseña. Inténtelo de nuevo más tarde.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.changePassword(); // Ejecutar después de que el usuario confirme el mensaje de error
            });
          }
        });
      }
    });
  }

  changeEmail() {
    // Abrimos formulario para consultar el email de user a recuperar la contraseña
    Swal.fire({
      title: 'Escriba su nuevo correo electrónico',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar email',
      cancelButtonText: 'Cancelar',
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
  
        // Verificar si el nuevo correo electrónico es igual al actual
        if (email === this.user.email) {
          Swal.showValidationMessage('El nuevo correo electrónico no puede ser igual al actual');
          return false;
        }
        
        // Si el correo electrónico es válido y diferente al actual, devolverlo para su uso posterior
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
        this.authService.enviarCorreoEmail(this.user.email, email).subscribe({
          next: () => {
            Swal.close();
  
            Swal.fire({
              title: 'Correo electrónico enviado',
              text: `Se le ha enviado un correo electrónico a ${email} para confirmar su nuevo email.`,
              icon: 'success'
            }).then(() => {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/auth');
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

  // Compara los valores actuales del formulario con los valores iniciales
  isFormChanged(): boolean {
    return JSON.stringify(this.updateForm.getRawValue()) !== JSON.stringify(this.initialFormValue);
  }
}