// Importaciones de módulos y servicios necesarios
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserTiendaService } from '../services/user-tienda.service';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '../models/user';
import { CestaService } from '../services/cesta.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // Variables de clase
  informacion: any = {};
  isAuthenticated = false;
  user!: User;
  isAdmin: boolean = false;
  numeroArticulosCesta: number = 0;

  constructor(
    private authService: AuthService,
    private userTiendaService: UserTiendaService,
    private router: Router,
    private cestaService: CestaService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeNavbar();
      }
    });

    this.sharedService.cartItems$.subscribe(count => {
      this.numeroArticulosCesta = count;
    });
    
    this.updateData();
  }

  updateData() {
    this.authService.authChanged.subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.updateUserAndRole();
        } else {
          this.user = {} as User;
        }
      }
    });

    this.checkAuthentication(); // Unificamos la lógica de autenticación inicial

    // Contar los productos y actualizar servicio
    this.cestaService.getCartProducts().subscribe(products => {
      this.sharedService.updateCartItems(products);
    });
  }

  // Verifica la autenticación del usuario
  checkAuthentication(): void {
    this.authService.tokenValidation().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.updateUserAndRole(); // Unificamos la actualización del usuario y rol
        } else {
          this.user = {} as User;
        }
      },
      error: (error) => console.error('Error during token validation', error)
    });
  }

  // Actualiza el usuario y el rol
  updateUserAndRole(): void {
    this.userTiendaService.getUser().subscribe({
      next: (user) => this.user = user,
      error: (error) => console.error('Error fetching user', error),
    });

    this.authService.isAdmin().subscribe({
      next: (role) => this.isAdmin = role,
      error: (error) => console.error('Error fetching user role', error)
    });
  }

  // Método para cerrar sesión
  logout(): void {
    Swal.fire({
      title: "¿Estas seguro de cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.authService.updateAuthStatus(false);
        this.isAuthenticated = false;
        this.user = {} as User;
        this.router.navigateByUrl('/auth');
      }
    });
  }

  closeNavbar(): void {
    const navbarCollapse = document.querySelector('#navbarSupportedContent') as HTMLElement;
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  }
}