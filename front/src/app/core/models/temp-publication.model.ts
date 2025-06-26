import {MetaData} from './file.model';

export interface Publication {
  id: number;
  titre: string;
  derniereModif: {
    date: string; // ou Date si tu les convertis automatiquement
  };
  utilisateur_id_id: number;
  utilisateur_id_prenom: string;
  utilisateur_id_nom: string;
  contenuTexte?: string;
  contenuFichier?: string;
  typePublicationId: {
    id: number; // 2 = fichier, 3 = calendrier, 4 = alerte, 5 = info
  };
  visible: boolean;
  section_id: number;
}

export interface real_Publication {
  _id: number;
  nom: string;
  date_publication: string;
  publicateur_id: number;
  type: string;
  metadata?: MetaData;
  contenu?: string;
  importance?: string;
  visible: boolean;
  eleves_consulte: number[];
}
