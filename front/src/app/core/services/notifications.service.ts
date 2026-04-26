import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Notifications} from '../models/notifications';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  
  private base = `${environment.apiUrl}/notifications/user/'`;
  
  constructor( private http: HttpClient) {


  }

  getNotificationForUser(id : number): Observable<Notifications[]> {
    console.log(id);
    return this.http.get<Notifications[]>(this.base + id);
  }

}
