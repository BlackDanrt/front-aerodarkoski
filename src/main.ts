/**
 * Punto de entrada principal de la aplicación.
 *
 * Inicializa el módulo raíz y arranca la ejecución
 * de la aplicación Angular en el navegador.
 * @author Juan Martinez
 * @version 1.0
 */
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {

})
  .catch(err => console.error(err));
