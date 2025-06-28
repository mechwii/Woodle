import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Notifications} from '../models/notifications';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private base = 'http://localhost:3000/notifications/user/';
  constructor( private http: HttpClient) {


  }

  getNotificationForUser(id : number): Observable<Notifications[]> {
    console.log(id);
    return this.http.get<Notifications[]>(this.base + id);
  }

}
