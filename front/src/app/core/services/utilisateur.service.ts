import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {userPopupForm, UserResponse, UtilisateurResponse} from '../models/user.model';
import {Roles} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}

  getAllUsers() : Observable<UserResponse> {
    return this.http.get<UserResponse>(this.baseUrl + '/users/all-users')
  }

  getUserById(id : number) : Observable<UserResponse> {
  return this.http.get<UserResponse>(this.baseUrl + '/users/get-user/' + id);
  }

  getAllRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.baseUrl + '/users/all-roles');
  }

  createUser(data : userPopupForm) : Observable<UtilisateurResponse> {
    return this.http.post<UtilisateurResponse>(this.baseUrl + '/users/add-user', data);
  }

  editUser(data : userPopupForm, id:number) : Observable<UtilisateurResponse> {
    return this.http.put<UtilisateurResponse>(this.baseUrl + '/users/edit-user/' + id, data);
  }

  deleteUser(id:number) : Observable<UtilisateurResponse> {
    return this.http.delete<UtilisateurResponse>(this.baseUrl + '/users/delete-user/' + id);
  }

  getUsersByGroup(id:number) : Observable<UserResponse> {
    return this.http.get<UserResponse>(this.baseUrl + '/users/users-by-role/' + id);
  }
}

