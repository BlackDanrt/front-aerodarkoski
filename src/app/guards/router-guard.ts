import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {ToastService} from '../services/toast-service';

export const routerGuard: CanActivateFn = (route, state) => {

  /** Instancia del servicio de autenticación */
  const auth = inject(AuthService);

  /** Instancia del enrutador de angular*/
  const router = inject(Router);

  const toast = inject(ToastService);

  /** Token JWT del usuario */
  const token = auth.getUsuarioToken();

  if (!token) {
    alert('Para acceder a la página debes iniciar sesión');
    router.navigate(['/login']);
    return false;
  }

  /** Roles requeridos para el acceso a la ruta*/
  const requiredRoles: string[] = route.data['roles'];

  if (!requiredRoles || requiredRoles.length === 0) return true;

  /** Rol de usuario */
  const userRole: string = token.role;

  if (!requiredRoles.includes(userRole)) {
    toast.mostrar('No tienes permiso para acceder a esta página', false);
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
