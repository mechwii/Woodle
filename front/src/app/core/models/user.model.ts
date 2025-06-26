import {Roles} from './auth.model';


export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email?: string;
  mot_de_passe? : string;
  image: string;
  roles? : Roles[];
}

export interface userPopupForm {
  nom: string;
  prenom: string;
  email: string;
  image: string;
  password : string;
  roles : string[];
  UE : number[];
}
/*
{
    "nom" : "Momo",
    "prenom" : "Mama",
    "email" : "Momo@Maaamaaaaaaaaaaaaa.com",
    "image" : "Apagnan.jpg",
    "password" : "Test1234",
    "roles" : [1, 2],
    "UE" : ["RS40"]
}
 */



export interface UtilisateurResponse {
  message : string;
}

export type  UserResponse = Utilisateur[] | Utilisateur | UtilisateurResponse;
