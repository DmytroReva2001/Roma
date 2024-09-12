import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { VistaProductoComponent } from './vista-producto/vista-producto.component';
import { MenuRopaComponent } from './menu-ropa/menu-ropa.component';
import { ContactoComponent } from './contacto/contacto.component';
import { TatuajesComponent } from './tatuajes/tatuajes.component';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { NuevoTatuajeComponent } from './nuevo-tatuaje/nuevo-tatuaje.component';
import { NuevoTipoProductoComponent } from './nuevo-tipo-producto/nuevo-tipo-producto.component';
import { AuthComponent } from './auth/auth.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ProductosAdminComponent } from './productos-admin/productos-admin.component';
import { ActivateComponent } from './activate/activate.component';
import { NuevaClaveComponent } from './nueva-clave/nueva-clave.component';
import { VistaTatuajeComponent } from './vista-tatuaje/vista-tatuaje.component';
import { GestionComponent } from './gestion/gestion.component';
import { NuevaInformacionComponent } from './nueva-informacion/nueva-informacion.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { CestaComponent } from './cesta/cesta.component';
import { NuevoEmailComponent } from './nuevo-email/nuevo-email.component';
import { CompraComponent } from './compra/compra.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuPrincipalComponent,
    VistaProductoComponent,
    MenuRopaComponent,
    ContactoComponent,
    TatuajesComponent,
    NuevoProductoComponent,
    NuevoTatuajeComponent,
    NuevoTipoProductoComponent,
    AuthComponent,
    MainLayoutComponent,
    ProductosAdminComponent,
    ActivateComponent,
    NuevaClaveComponent,
    VistaTatuajeComponent,
    GestionComponent,
    NuevaInformacionComponent,
    MiPerfilComponent,
    CestaComponent,
    NuevoEmailComponent,
    CompraComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'), // Función para obtener el token de localStorage
      }
    }),

  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
