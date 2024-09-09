// Importaciones de módulos y servicios necesarios
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfoService } from '../services/info.service';
import { AuthService } from '../services/auth.service';
import { UserTiendaService } from '../services/user-tienda.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  // Variables de clase
  informacion: any = {};
  isAuthenticated = false;
  user!: User;
  isAdmin: boolean = false;
  private authSubscription: Subscription | undefined;

  // Constructor para inicializar servicios y obtener información
  constructor(
    private infoService: InfoService,
    private authService: AuthService,
    private userTiendaService: UserTiendaService,
    private router: Router
  ) {
    this.infoService.getInformacion().subscribe(datos => {
      datos.forEach(item => {
        this.informacion[item.dato] = item.valor;
      });
    });
  }

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.checkAuthentication();
    this.authSubscription = this.authService.authChanged.subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.updateUser();
        } else {
          this.user = {} as User;
        }
      }
    });
  }

  // Método que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Verifica la autenticación del usuario
  checkAuthentication(): void {
    this.authService.tokenValidation().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.updateUser();
          this.updateRoleUser();
        } else {
          this.user = {} as User;
        }
      },
      error: (error) => console.error('Error during token validation', error)
    });
  }

  // Actualiza el rol del usuario
  updateRoleUser() 
  {
    this.authService.isAdmin().subscribe({
      next: (role) => this.isAdmin = role,
      error: (error) => console.error('Error fetching user name', error)
    });
  }

  // Actualiza el usuario
  updateUser(): void {
    this.userTiendaService.getUser().subscribe({
      next: (user) => this.user = user,
      error: (error) => console.error('Error fetching user', error),
    });
  }  

  // Método para cerrar sesión
  logout(): void {
    // Muestra un mensaje de confirmación antes de cerrar sesión
    Swal.fire({
      title: "¿Estas seguro de cerrar sesión?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        // Elimina el token del almacenamiento local, actualiza el estado de autenticación y redirige a la página de inicio de sesión
        localStorage.removeItem('token');
        this.authService.updateAuthStatus(false);
        this.isAuthenticated = false;
        this.user = {} as User;
        this.router.navigateByUrl('/auth');
      }
    });
  }
}