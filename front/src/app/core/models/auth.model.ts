export interface UserInResponse {
  id_utilisateur: number;
  roles : Roles[];
}

export interface Roles {
  id_role : number;
  nom : string;
}

export interface LoginFailure {
  success: boolean;
  message: string;
}

export interface LoginSuccess {
  // token: string; -> Token on fera peut être plus tard
  data: UserInResponse;
}

export interface LoginFailure {
  success: boolean;
}


export type LoginResponse = LoginSuccess | LoginFailure;
