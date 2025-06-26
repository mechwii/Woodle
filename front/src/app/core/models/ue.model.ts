import {FileModel} from './file.model';
import {Publication} from './temp-publication.model';

export interface UE {
  code : string;
  nom : string;
  nom_utilisateur : string;
  prenom_utilisateur : string;
  images : FileModel;
  responsable_id : number;
  eleves_affectes : number[];
  professeurs_affectes : number[];
  sections? : Publication[];
  forums? : [];
  devoirs? : [];

}

export interface UeError {
  message: string;
}

export type UeResponse = UE[] | UE | UeError;
