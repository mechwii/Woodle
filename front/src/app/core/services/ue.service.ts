import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponse} from '../models/user.model';
import {UeResponse} from '../models/ue.model';

@Injectable({
  providedIn: 'root'
})
export class UeService {

  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}

  getAllUEs() : Observable<UeResponse> {
    return this.http.get<UeResponse>(this.baseUrl + '/ue/all-ue')
  }

}
