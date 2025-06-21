import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}

  getAllUsers() : Observable<UserResponse> {
    return this.http.get<UserResponse>(this.baseUrl + '/users/all-users')
  }
}
