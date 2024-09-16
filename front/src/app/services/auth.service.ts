import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { InfoService } from './info.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'auth';
  
  // BehaviorSubject para mantener el estado de autenticación
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Variable observable para controlar estado de autenticación
  public authChanged: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Constructor que inicializa la URL de la API y realiza la validación del token al iniciar
  constructor(private http: HttpClient, private infoService: InfoService, private jwtHelper: JwtHelperService) {
    this.apiUrl = this.infoService.getAuthUrl() + this.apiUrl;

    this.tokenValidation().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticatedSubject.next(isAuthenticated);
      }
    });
  }

  // Método para realizar el login de un usuario
  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // Método para registrar un nuevo usuario
  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  // Método para validar el token de autenticación
  tokenValidation(): Observable<boolean> {
    const token = localStorage.getItem('token');

    const isAuthenticated = !!token; // Verifica que token tenga un valor válido
  
    return of(isAuthenticated);
  }
  
  // Método para verificar si un usuario es administrador
  isAdmin(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (token) {

      const tokenPayload = this.jwtHelper.decodeToken(token);

      const isAdmin = tokenPayload.rol === 'ADMIN';

      return of(isAdmin)
    } else {
      return of(false);
    }
  }

  // Método para obtener el email del token decodificado
  getEmail(token: string): string
  {
    const tokenPayload = this.jwtHelper.decodeToken(token);

    if (tokenPayload.exp * 1000 < Date.now()) {
      return '';
    }
    return tokenPayload.sub;
  }

  // Método para actualizar el estado de autenticación
  updateAuthStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Método para cambiar la contraseña de un usuario
  changePassword(email: any, newPass: any) {
    const params = new HttpParams()
    .set('email', email)
    .set('password', newPass);
    return this.http.get<any>(`${this.apiUrl}/reset_password`, { params });
  }

  changeAccountPassword(email: string, oldPass: string, newPass: string) {
    const params = new HttpParams()
    .set('email', email)
    .set('oldPass', oldPass)
    .set('newPass', newPass);
    return this.http.get<any>(`${this.apiUrl}/reset_account_password`, { params });
  }

  // Método validador personalizado para la fortaleza de la contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return { passwordStrength: 'La contraseña es requerida.' };
    }

    // Validadores de la fortaleza de la contraseña
    const hasMinLength = value.length >= 6;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // Validación
    const passwordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.' } : null;
  }

  // Método para enviar un correo para restablecer la contraseña
  enviarCorreoPassword(email: any): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/email_reset_password`, { params });
  }

  // Método para reenviar la activación de la cuenta de usuario
  reenviarActivacionUser (token:string): Observable<any>
  {
    const tokenPayload = this.jwtHelper.decodeToken(token);

    const params = new HttpParams().set('email', tokenPayload.sub);
    return this.http.get<any>(`${this.apiUrl}/email_activar_cuenta`, { params });
  }

  // Método para cambiar el email
  enviarCorreoEmail (oldEmail: string, newEmail:string,): Observable<any>
  {
    const params = new HttpParams()
      .set('oldEmail', oldEmail)
      .set('newEmail', newEmail);

    return this.http.get<any>(`${this.apiUrl}/send_change_email`, { params });
  }

    // Método para cambiar la contraseña de un usuario
    changeEmail(oldEmail: any, newEmail: any) {
      const params = new HttpParams()
      .set('oldEmail', oldEmail)
      .set('newEmail', newEmail);
      return this.http.get<any>(`${this.apiUrl}/change_email`, { params });
    }

    isTokenExpired(): boolean {
      const token = localStorage.getItem('token');
      
      // Si no hay token, considerarlo como expirado (no válido)
      if (!token) {
        return false;
      }
  
      // Retornar si el token ha expirado
      return this.jwtHelper.isTokenExpired(token);
    }
}