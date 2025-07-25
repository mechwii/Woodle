import {FileModel} from './file.model';

export interface Section {
  _id : number;
  nom : string;
  publications : Publication[];
  devoirs : Devoirs[];
  forums : Forum[];
}

export interface Publication {
  _id?: number;
  nom: string;
  publicateur_id? : number;
  date_publication? : string;
  visible: boolean;
  type : string
  metadata?: FileModel;
  eleves_consulte? : number[];
  importance? : string;
  contenu? : string;
}

export interface Devoirs {
  _id? : number;
  titre : string;
  description :string;
  publicateur_id: number;
  date_creation?: string;
  date_limite: string;
  instructions : Instruction;
  soumissions?: Soumission[];
}

export interface Soumission {
  _id?: number;
  etudiant_id: number;
  date_soumission?:string;
  statut?:string;
  fichiers:FileModel;
  note? : number;
  commentaire_prof? : string;
  correcteur_id? : number;
  date_correction?:string;


}

export interface Instruction {
  taille_fichier : number;
  type_fichier : string;
}

export interface Message {
  _id: number;
  auteur_id: number;
  contenu: string;
  date_message: string;
}

export interface Sujet {
  _id?: number;
  titre: string;
  auteur_id?: number;
  date_creation?: string;
  messages?: Message[];
}

export interface Forum {
  _id?: number;
  titre: string;
  description: string;
  createur_id: number;
  date_creation?: string;
  sujets?: Sujet[];
}
