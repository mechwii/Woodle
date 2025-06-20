import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../models/auth.model';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

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
          console.log(res);
          console.log("laaaaa");
          }
        )
      )
  }

}
