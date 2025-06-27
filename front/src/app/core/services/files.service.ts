import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MetaData} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private base = 'http://localhost:3000/upload/';

  constructor(private http: HttpClient) {}

  upload(file: File, code : string): Observable<MetaData> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<MetaData>(`${this.base}add-files/${code}`, fd)
  }

  getFile(code: string, name: string): Observable<Blob> {
    return this.http.get(`${this.base}get-files/${code}/${name}`, {
      responseType: 'blob'
    });
  }

}
