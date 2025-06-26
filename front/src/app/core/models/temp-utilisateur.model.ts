export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  roles: string[]; // ex: ['ROLE_PROFESSEUR']
  image: string;
}
