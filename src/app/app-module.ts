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

@NgModule({
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
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
