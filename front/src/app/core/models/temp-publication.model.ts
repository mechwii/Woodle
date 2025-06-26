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
