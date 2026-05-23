import { Rol } from '../enums/rol';

export interface TokenJwt {
  id:number
  sub: string;
  role:Rol;
}
