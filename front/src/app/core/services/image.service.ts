import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {MetaData} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private base = 'http://localhost:3000/upload/image';

  constructor(private http: HttpClient) {}

  /** Retourne un blobURL prêt pour <img> */
  getImageURL(name: string, mode :string) {
    return this.http
      .get(`${this.base}/${mode}/${name}`, { responseType: 'blob' })
      .pipe(map(b => URL.createObjectURL(b)));
  }

  /** Upload (FormData)
  upload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{filename: string}>(this.base, fd);
  } */

  /** Supprime */
  remove(name: string, mode :string) {
    return this.http.delete(`${this.base}/${mode}/${name}`);
  }

  uploadImage(file: File, mode :string):  Observable<MetaData> {
    const formData = new FormData();
    formData.append('file', file); // 'file' doit correspondre au nom utilisé dans multer.single('file')

    return this.http.post<MetaData>(`${this.base}/${mode}`, formData);
  }
}

