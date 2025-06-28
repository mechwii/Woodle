import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {uePopup, UeResponse} from '../models/ue.model';
import {Publication, Section} from '../models/temp-publication.model';

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

  getUeByCode(code : string, logs : boolean = false, id_user : any = null): Observable<UeResponse> {
    const queryParams = logs ? `?logs=true&id_user=${id_user}` : '';
    return this.http.get<UeResponse>(this.baseUrl + '/ue/get-ue/' + code + queryParams)
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

  addSection(code : string, data : any) : Observable<Section> {
    return this.http.post<Section>(this.baseUrl + '/ue/add-section/'+code, data)
  }

  deleteSection(code : string, id : number) : Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/ue/delete-section/'+code + '/'+id);
  }

  editSection(code : string, id :number ,data : any) : Observable<any> {
    return this.http.put(this.baseUrl + '/ue/edit-section/'+code + '/'+id, data)
  }

  addPublication(code : string, secId : number ,data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-publication/'+code + '/'+secId, data)
  }

  getSection(code : string, secId : number) : Observable<Section> {
    return this.http.get<Section>(this.baseUrl + '/ue/get-section/'+code + '/'+secId);
  }

  getPublication(code : string, secId : number, pubId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-publication/'+code + '/'+secId + '/'+pubId);
  }

  getPublicatioBySection(code : string, secId : number) : Observable<Publication[]> {
    return this.http.get<Publication[]>(this.baseUrl + '/ue/get-publications-by-section/'+code + '/'+secId);
  }

  deletePublication(code : string, secId : number, pubId : number) : Observable<any> {
    return this.http.delete(this.baseUrl + '/ue/delete-publication/'+code + '/'+secId + '/'+pubId);
  }

  updatePublication(code : string, secId : number, pubId : any, data : any) : Observable<any> {
    return this.http.put(this.baseUrl + '/ue/edit-publication/'+code + '/'+secId + '/'+pubId, data);
  }

  getDevoirsForSection(code : string, secId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-all-devoirs/'+code + '/'+secId);
  }

  addDevoir(code : string, secId : number, data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-devoir/'+code + '/'+secId, data);
  }

  deleteDevoir(code : string, secId : number, devoirId : number) : Observable<any> {
    return this.http.delete(this.baseUrl + '/ue/delete-devoir/'+code + '/'+secId + '/'+devoirId);
  }

  getDevoirBySectionAndId(code : string, secId : number, devoirId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-devoir/'+code + '/'+secId + '/'+devoirId);
  }

  addSoumission(code : string, secId : number,devoirId : number, data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-soumission/'+code + '/'+secId+ '/'+devoirId, data);
  }

  getSoumissionByUserId(code : string, secId : number, devoirId : number, userId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-soumission-by-user/'+code + '/'+secId+ '/'+devoirId + '/'+userId);
  }

  corrigerSoumissionUser(code : string, secId : number, devoirId : number, soumissionId : number, data : any) : Observable<any> {
    return this.http.put(this.baseUrl + '/ue/corriger-soumission/'+code + '/'+secId+ '/'+devoirId + '/'+soumissionId, data);
  }

  getForumsForSection(code : string, secId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-all-forums/'+code + '/'+secId);
  }

  getForumBySectionAndId(code : string, secId : number, forumId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-forum/'+code + '/'+secId + '/'+forumId);
  }

  addForum(code : string, secId : number, data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-forum/'+code + '/'+secId, data);
  }

  deleteForum(code : string, secId : number, forumId : number) : Observable<any> {
    return this.http.delete(this.baseUrl + '/ue/delete-forum/'+code + '/'+secId + '/'+forumId);
  }

  getSujetsForForum(code: string, secId: number, forumId: number | undefined) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-all-sujets/'+code + '/'+secId + '/'+forumId);
  }

  addSujet(code : string, secId : number, forumId: number | undefined, data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-sujet/'+code + '/'+secId+ '/'+forumId, data);
  }

  getSujetByForumAndId(code : string, secId : number, forumId : number, sujetId : number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-sujet/'+code + '/'+secId + '/'+forumId + '/'+sujetId);
  }

  getMessagesForSujet(code: string, secId: number, forumId: number | undefined, sujetId: number) : Observable<any> {
    return this.http.get(this.baseUrl + '/ue/get-all-messages/'+code + '/'+secId + '/'+forumId + '/'+sujetId);
  }

  addMessage(code : string, secId : number, forumId: number | undefined, sujetId: number, data : any) : Observable<any> {
    return this.http.post(this.baseUrl + '/ue/add-message/'+code + '/'+secId+ '/'+forumId + '/'+sujetId, data);
  }

  deleteMessage(code : string, secId : number, forumId: number | undefined, sujetId: number, messageId : number) : Observable<any> {
    return this.http.delete(this.baseUrl + '/ue/delete-message/'+code + '/'+secId + '/'+forumId + '/'+sujetId + '/'+messageId);
  }
}
