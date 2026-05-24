import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Nav } from './nav/nav';
import { Login } from './login/login';
import { Main } from './main/main';
import { Registro } from './registro/registro';
import { FormsModule } from '@angular/forms';
import { Perfil } from './perfil/perfil';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './interceptores/auth-interceptor-interceptor';
import { Principal } from './principal/principal';
import { Mapa } from './mapa/mapa';
import { UsuarioCrud } from './usuario-crud/usuario-crud';
import { AuditoriaComponent } from './auditoria/auditoria';
import { Busqueda } from './busqueda/busqueda';
import { HistorialComponent } from './historial-component/historial-component';

/**
 * Módulo raíz de la aplicación AeroDarkoski.
 *
 * Declara los componentes principales, configura los módulos
 * necesarios para el funcionamiento de la aplicación y registra
 * los proveedores globales como el cliente HTTP y los interceptores.
 *
 * @author Juan Martinez
 * @version 1.0
 */
@NgModule({
  /** Componentes declarados en la aplicación */
  declarations: [
    App,
    Nav,
    Login,
    Main,
    Registro,
    Perfil,
    Principal,
    Mapa,
    UsuarioCrud,
    AuditoriaComponent,
    Busqueda,
    HistorialComponent,
  ],

  /** Módulos importados */
  imports: [BrowserModule, AppRoutingModule, FormsModule],

  /** Servicios globales */
  providers: [
    /**
     * Configura el manejo global de errores del navegador.
     */
    provideBrowserGlobalErrorListeners(),
    /**
     * Configura el cliente HTTP e incorpora el interceptor
     * encargado de adjuntar el token JWT a las peticiones.
     */
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
