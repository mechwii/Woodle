import {FileModel, MetaData} from './file.model';

export interface Section {
  _id : number;
  nom : string;
  publications : Publication[];
  devoirs : Devoirs[]
}

export interface Publication {
  _id?: number;
  nom: string;
  publicateur_id : number;
  date_publication? : string;
  visible: boolean;
  type : string
  metadata?: FileModel;
  eleves_consulte? : number[];
  importance? : string;
  contenu? : string;
  soumissions?: Soumission[];
}

export interface Devoirs {
  _id : number;
  titre : string;
  description :string;
  publicateur_id: number;
  date_creation:"";
  date_limite: "";
  visible:true;
  instructions : Instruction;
}

export interface Soumission {
  _id: number;
  etudiant_id: number;
  date_soumission:string;
  statut:string;
  fichiers:FileModel;
  note : number;
  commentaire_prof : string;
  correcteur_id : number;
  date_correction:string;


}

export interface Instruction {
  taille_fichier : number;
  type_fichier : number;
}
