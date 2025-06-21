export interface UE {
  code : string;
  nom : string;
  nom_utilisateur : string;
  prenom_utilisateur : string;
  image : string;
  responsable_id : number
}

export interface UeError {
  message: string;
}

export type UeResponse = UE[] | UeError;
