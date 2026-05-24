import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Login} from './login/login';
import {Main} from './main/main';
import {Registro} from './registro/registro';
import {Perfil} from './perfil/perfil';
import {Principal} from './principal/principal';
import {UsuarioCrud} from './usuario-crud/usuario-crud';
import {AuditoriaComponent} from './auditoria/auditoria';
import {routerGuard} from './guards/router-guard';
import {Busqueda} from './busqueda/busqueda';
import {HistorialComponent} from './historial-component/historial-component';

/**
 * Configuración de rutas de la aplicación.
 *
 * Define la navegación entre componentes y los permisos
 * necesarios para acceder a las rutas protegidas.
 */
const routes: Routes = [

  { path: 'login', component: Login},
  { path: 'registro', component: Registro, },
  { path: 'main', component: Main },
  { path: 'perfil', component: Perfil, canActivate: [routerGuard], data:{'roles': ['USUARIO','ADMINISTRADOR'] }},
  { path: 'principal', component: Principal, canActivate: [routerGuard], data:{'roles': ['USUARIO','ADMINISTRADOR'] }},
  { path: 'usuarios', component: UsuarioCrud, canActivate: [routerGuard], data:{'roles': ['ADMINISTRADOR'] }},
  { path: 'auditoria', component: AuditoriaComponent, canActivate: [routerGuard], data:{'roles': ['ADMINISTRADOR'] }},
  { path: 'busqueda/:codigo/:tipo', component: Busqueda, canActivate: [routerGuard], data:{'roles': ['USUARIO','ADMINISTRADOR'] }},
  { path: 'historial/:id', component: HistorialComponent, canActivate: [routerGuard], data:{'roles': ['USUARIO', 'ADMINISTRADOR']}},
  { path: '', redirectTo: '/main', pathMatch: 'full'},
];

/**
 * Módulo encargado de la configuración del enrutamiento
 * principal de la aplicación.
 *
 * Gestiona la navegación entre vistas, las redirecciones
 * y la protección de rutas mediante guards.
 * @author Juan Martinez
 * @version 1.0
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
