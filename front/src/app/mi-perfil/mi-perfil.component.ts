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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
      password: ['', [Validators.required, authService.passwordValidator]],
      imagen: ['', [Validators.required]]
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
          id: this.user.id,
          nombre: this.user.nombre,
          apellidos: this.user.apellidos,
          telefono: this.user.telefono,
          email: this.user.email,
          password: this.user.password,
          imagen: this.user.imagen
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
            text: error.error.message,
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
    const fileInputElement = this.fileInput.nativeElement;
    fileInputElement.click();
  }

  handleFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.user.imagen = result;

        this.updateForm.patchValue({
          imagen: this.user.imagen
        });
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility() {
    const passwordFieldElement = document.getElementById('password');
  
    if (passwordFieldElement) {
      if (passwordFieldElement.getAttribute('type') === 'password') {
        passwordFieldElement.setAttribute('type', 'text');
      } else {
        passwordFieldElement.setAttribute('type', 'password');
      }
    }
  }

  // SEGUIR AQUÍ
  changePassword() {
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
        
        // Suscribirse al método del servicio que maneja el inicio de procedimiento de recuperación de contraseña
        this.authService.enviarCorreoPassword(this.user.email).subscribe({
          next: () => {
            Swal.close();

            Swal.fire({
              title: 'Se ha enviado un correo electrónico',
              text: `Se le ha enviado un correo electrónico a ${this.user.email} para cambiar su contraseña.`,
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