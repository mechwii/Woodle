import {Roles} from './auth.model';


export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  image: string;
  roles : Roles[];
}

export interface UtilisateurFailure {
  message : string;
}

export type  UserResponse = Utilisateur[] | UtilisateurFailure;
