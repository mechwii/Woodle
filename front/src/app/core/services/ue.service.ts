import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {uePopup, UeResponse} from '../models/ue.model';
import {UtilisateurResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UeService {

  private baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}

  getAllUEs() : Observable<UeResponse> {
    return this.http.get<UeResponse>(this.baseUrl + '/ue/all-ue')
  }

  getAllUeForUserId(id : number, mode : string) : Observable<UeResponse> {
    const modeDisplay = mode ? '?mode=' + mode : '';
    return this.http.get<UeResponse>(this.baseUrl + '/ue/get-ue-users/'+ id +modeDisplay)
  }

  getUeByCode(code : string): Observable<UeResponse> {
    return this.http.get<UeResponse>(this.baseUrl + '/ue/get-ue/' + code)
  }

  addNewUe(data : uePopup) : Observable<UeResponse> {
    return this.http.post<UeResponse>(this.baseUrl + '/ue/add-ue', data)
  }

  editUE(data : uePopup, code: string) : Observable<UeResponse> {
    return this.http.put<UeResponse>(this.baseUrl + '/ue/edit-ue/'+code, data)
  }

  deleteUE(code : string) : Observable<any> {
    return this.http.delete<UeResponse>(this.baseUrl + '/ue/delete/'+code)
  }


}
