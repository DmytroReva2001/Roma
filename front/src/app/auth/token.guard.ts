import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CanActivateFn } from '@angular/router';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

// Clase para controlar el tema de token y roles de usuario autenticado
export const AuthRoleGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const restrictedRoutes = ['/nuevo_producto', '/nuevo_tipo_producto', '/nuevo_tatuaje', '/productos_admin', '/gestion', '/nuava_informacion'];

  // Consultamos el método de validación de token
  return authService.tokenValidation().pipe(
    // Consultamos si hay user autenticado cuando accede a un ruta restringuida
    switchMap(isAuthenticated => {
      // Si user no está autenticado
      if (!isAuthenticated) {
        // Lo dirigimos a login
        router.navigateByUrl('/auth');
        return of(false);
      } 
      // Si tiene token, comprobar que sea válido
      else if (isAuthenticated && authService.isTokenExpired())
      {
        // Eliminar token si se caducó
      localStorage.removeItem('token');

      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Redirigir a la página de login
        router.navigate(['/auth']);
      });

      return of(false);
      }
      // Si tiene token válido
      else {
        // Verificar el rol de administrador antes de permitir acceso a rutas específicas
        if (restrictedRoutes.some(route => state.url.includes(route))) {
          // Comprobamos al user
          return authService.isAdmin().pipe(
            map(isAdmin => {
              if (!isAdmin) {
                // Si no es admin se dirige a menú principalx
                router.navigateByUrl('/menu_principal');
                return false;
              }
              // Si todo Ok, user accede a la ruta
              return true;
            }),
            catchError(() => {
              // En caso de error, no sabemos el rol y dirigimos al user a login
              router.navigateByUrl('/auth');
              return of(false);
            })
          );
        }
        return of(true);
      }
    }),
    catchError(() => {
      // Si hay error general se dirige a menú principal
      router.navigateByUrl('/auth');
      return of(false);
    })
  );
};

export const AuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Consultamos el método de validación de token
  return authService.tokenValidation().pipe(
    // Consultamos si hay user autenticado cuando accede a un ruta restringuida
    switchMap(isAuthenticated => {
      // Si user no está autenticado
      if (!isAuthenticated) {
        // Lo dirigimos a login
        router.navigateByUrl('/auth');
        return of(false);
      }
      else if (isAuthenticated && authService.isTokenExpired())
        {
          // Eliminar token si se caducó
        localStorage.removeItem('token');
  
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a la página de login
          router.navigate(['/auth']);
        });
  
        return of(false);
        } 
      // Si tiene token
      else {
        return of(true);
      }
    }),
    catchError(() => {
      // Si hay error general se dirige a menú principal
      router.navigateByUrl('/auth');
      return of(false);
    })
  );
}