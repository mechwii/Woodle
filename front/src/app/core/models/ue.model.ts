import {FileModel, MetaData} from './file.model';
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

export interface uePopup{
  code : string,
  nom : string,
  image : FileModel,
  responsable_id : number,
  utilisateurs_affectes : number[];
}

export type UeResponse = UE[] | UE | UeError;
