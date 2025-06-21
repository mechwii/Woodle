import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse, LoginSuccess} from '../models/auth.model';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}


  sendLoginRequestToServer(email : string , password : string) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.baseUrl+ '/users/login',{email, password})
  }


  login(email : string, password : string) : Observable<LoginResponse> {
    console.log("aaaaaa");
      return this.sendLoginRequestToServer(email,password)
        .pipe(
        // Ici avec pipe va nous permettre d'effectuer une action avant qu'elles arrivent donc notamment mettre un token a l'aide de tap
        tap( res => {
          if(res && (res as LoginSuccess).data){
            const result = (res as LoginSuccess).data;
            const roles : number[] = result.roles.map(roles => roles.id_role);
            sessionStorage.setItem('id_utilisateur', result.id_utilisateur.toString());
            sessionStorage.setItem('roles', JSON.stringify(roles));
          }
          }
        )
      )
  }

  logout() : void {
    sessionStorage.removeItem('id_utilisateur');
    sessionStorage.removeItem('roles');
  }

  isLoggedIn(): boolean {
    try {
      return !!sessionStorage.getItem('id_utilisateur');
    } catch {
      return false;
    }
  }

  isAdmin() : boolean {
    const rolesString = sessionStorage.getItem('roles');
    if (!rolesString) return false;

    try {
      const roles: number[] = JSON.parse(rolesString);
      return Array.isArray(roles) && roles.includes(1);
    } catch {
      return false;
    }
  }

  isEtudiant() : boolean {
    const rolesString = sessionStorage.getItem('roles');
    if (!rolesString) return false;

    try {
      const roles: number[] = JSON.parse(rolesString);
      return Array.isArray(roles) && roles.includes(3);
    } catch {
      return false;
    }
  }

  isProfesseur() : boolean {
    const rolesString = sessionStorage.getItem('roles');
    if (!rolesString) return false;

    try {
      const roles: number[] = JSON.parse(rolesString);
      return Array.isArray(roles) && roles.includes(2);
    } catch {
      return false;
    }
  }

  isAdminAndProfesseur() : boolean {
    return this.isAdmin() && this.isProfesseur();
  }

  getIdUser(): number {
    let id = sessionStorage.getItem('id_utilisateur');
    return parseInt((id as string));
  }
}
