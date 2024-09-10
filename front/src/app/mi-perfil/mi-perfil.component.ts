import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserTiendaService } from '../services/user-tienda.service';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{
  
  user!: User;
  updateForm!: FormGroup;
  accountImage: String = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userTiendaService: UserTiendaService,
    private fb: FormBuilder,
    authService: AuthService,
    private location: Location
  ) {
    this.updateForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required,]],
      telefono: ['', [Validators.required,]],
      email: ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, authService.passwordValidator]],
      imagen: ['', [Validators.required,]]
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
        
        // Actualizamos el formulario solo después de que los datos del usuario han sido cargados
        this.updateForm.patchValue({
          id: this.user.id,
          nombre: this.user.nombre,
          apellidos: this.user.apellidos,
          telefono: this.user.telefono,
          email: this.user.email,
          password: this.user.password,
          imagen: this.user.imagen
        });
  
        // Cerramos el Swal solo cuando terminamos de cargar el usuario
        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching user', error);
        Swal.close();
      }
    });
  }

  onSubmitUpdate() {

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
    if (this.updateForm.valid) {
      // Llamamos al método que inicia el procedimiento de Registro
      this.userTiendaService.updateUserData(this.updateForm.value).subscribe({
        next: () => {
          Swal.close();
          
          Swal.fire({
            title: "¡Éxito!",
            text: "Datos actualizados correctamente",
            icon: "success"
          });
        },
        error: (error: any) => {
          Swal.close();

          Swal.fire({
            icon: "error",
            title: "Se ha producido un error al actualizar",
            text: error.error.message,
          });
        }
      });
    }
  }

  back()
  {
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
        
      this.accountImage = result;
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

  changePassword()
  {

  }

  changeEmail()
  {

  }
}