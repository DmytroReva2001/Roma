import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { VistaProductoComponent } from './vista-producto/vista-producto.component';
import { MenuRopaComponent } from './menu-ropa/menu-ropa.component';
import { ContactoComponent } from './contacto/contacto.component';
import { TatuajesComponent } from './tatuajes/tatuajes.component';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { NuevoTatuajeComponent } from './nuevo-tatuaje/nuevo-tatuaje.component';
import { NuevoTipoProductoComponent } from './nuevo-tipo-producto/nuevo-tipo-producto.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRoleGuard } from './auth/token.guard';
import { AuthenticatedGuard } from './auth/token.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ProductosAdminComponent } from './productos-admin/productos-admin.component';
import { ActivateComponent } from './activate/activate.component';
import { NuevaClaveComponent } from './nueva-clave/nueva-clave.component';
import { VistaTatuajeComponent } from './vista-tatuaje/vista-tatuaje.component';
import { GestionComponent } from './gestion/gestion.component';
import { NuevaInformacionComponent } from './nueva-informacion/nueva-informacion.component';
import { CestaComponent } from './cesta/cesta.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NuevoEmailComponent } from './nuevo-email/nuevo-email.component';
import { CompraComponent } from './compra/compra.component';
import { MisPedidosComponent } from './mis-pedidos/mis-pedidos.component';
import { DatosEnvioComponent } from './datos-envio/datos-envio.component';

const routes: Routes = [
  // Componentes sin header y footer
  { path: 'auth/:url', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'activate', component: ActivateComponent },
  { path: 'nueva_clave', component: NuevaClaveComponent },
  { path: 'nuevo_email', component: NuevoEmailComponent },
  {
    path: '',
    component: MainLayoutComponent, // Utilizar MainLayoutComponent como contenedor principal
    children: [
      // Componentes con header y footer
      { path: '', redirectTo: '/menu_principal', pathMatch: 'full' },
      { path: 'menu_principal', component: MenuPrincipalComponent },
      { path: 'vista_producto/:id', component: VistaProductoComponent },
      { path: 'vista_tatuaje/:id', component: VistaTatuajeComponent },
      { path: 'menu_ropa', component: MenuRopaComponent },
      { path: 'menu_ropa/:tipoProducto', component: MenuRopaComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'tatuajes', component: TatuajesComponent },
      { path: 'nuevo_producto', component: NuevoProductoComponent, canActivate: [AuthRoleGuard] },
      { path: 'nueva_informacion', component: NuevaInformacionComponent, canActivate: [AuthRoleGuard] },
      { path: 'nuevo_tatuaje', component: NuevoTatuajeComponent, canActivate: [AuthRoleGuard] },
      { path: 'nuevo_tipo_producto', component: NuevoTipoProductoComponent, canActivate: [AuthRoleGuard] },
      { path: 'nuevo_producto/:id', component: NuevoProductoComponent, canActivate: [AuthRoleGuard] },
      { path: 'nueva_informacion/:id', component: NuevaInformacionComponent, canActivate: [AuthRoleGuard] },
      { path: 'nuevo_tatuaje/:id', component: NuevoTatuajeComponent, canActivate: [AuthRoleGuard] },
      { path: 'nuevo_tipo_producto/:id', component: NuevoTipoProductoComponent, canActivate: [AuthRoleGuard] },
      { path: 'productos_admin', component: ProductosAdminComponent, canActivate: [AuthRoleGuard] },
      { path: 'gestion/:elemento', component: GestionComponent, canActivate: [AuthRoleGuard] },
      { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [AuthenticatedGuard] },
      { path: 'cesta', component: CestaComponent },
      { path: 'compra', component: CompraComponent, canActivate: [AuthenticatedGuard]},
      { path: 'mis_pedidos', component: MisPedidosComponent, canActivate: [AuthenticatedGuard]},
      { path: 'datos_envio', component: DatosEnvioComponent, canActivate: [AuthenticatedGuard]},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
