import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor HTTP encargado de agregar el token JWT
 * en la cabecera Authorization de cada petición.
 *
 * @author Juan Martinez
 * @version 1.0
 */
export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  /** Token JWT almacenado en el localStorage */
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
