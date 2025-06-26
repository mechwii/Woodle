import { Component } from '@angular/core';
import {BannerUeComponent} from '../components/banner-ue/banner-ue.component';
import {StatistiqueBlocComponent} from '../components/statistique-bloc/statistique-bloc.component';
import {
  InteractionsSectionsBlocComponent
} from '../components/interactions-sections-bloc/interactions-sections-bloc.component';
import {EpinglesComponent} from '../components/epingles/epingles.component';

// import des models
import { Utilisateur } from '../../../core/models/temp-utilisateur.model';
import { UniteEnseignement } from '../../../core/models/temp-ue.model';
import { Publication } from '../../../core/models/temp-publication.model';
import {Section} from '../../../core/models/section.model';
import {BlocSectionsComponent} from '../components/bloc-sections/bloc-sections.component';
import {AddSectionComponent} from '../modal/add-section/add-section.component';
import {UserListComponent} from '../modal/user-list/user-list.component';

@Component({
  selector: 'app-professeur-contenu-ue',
  imports: [
    BannerUeComponent,
    StatistiqueBlocComponent,
    InteractionsSectionsBlocComponent,
    EpinglesComponent,
    BlocSectionsComponent,
    AddSectionComponent,
    UserListComponent

  ],
  templateUrl: './professeur-contenu-ue.component.html',
  styleUrl: './professeur-contenu-ue.component.css'
})
export class ProfesseurContenuUeComponent {

  uniteEnseignement = {
    nom: 'Programmation Web Nuancée',
    id: 'IA41',
    responsable: "Jonesy",
    image: 'no'
  };

  utilisateur = {
    id: 1,
    nom: 'Martin',
    prenom: 'Thomas',
    roles: ['PROFESSEUR'],
    image: 'https://wallpapercave.com/wp/wp12469236.jpg'
  }

  nbElevesUe = 123;     // data for stats ue eleve
  nbProfsUe = 5;         // data for stats ue prof

  publicationsEpingles: Publication[] = [
    {
      id: 101,
      titre: 'Chapitre 1 - Introduction',
      derniereModif: {date: '2025-06-20T14:30:00'},
      utilisateur_id_id: 1,
      utilisateur_id_prenom: 'Thomas',
      utilisateur_id_nom: 'Martin',
      contenuTexte: 'Bienvenue dans le cours. Voici le plan de la semaine.',
      typePublicationId: {id: 5}, // info
      visible: true,
      section_id: 0
    },
    {
      id: 102,
      titre: 'TD à remettre',
      derniereModif: {date: '2025-06-19T09:00:00'},
      utilisateur_id_id: 2,
      utilisateur_id_prenom: 'Alice',
      utilisateur_id_nom: 'Dupont',
      contenuTexte: 'Merci de rendre le TD avant vendredi.',
      typePublicationId: {id: 4}, // warning
      visible: true,
      section_id: 0
    },
    {
      id: 103,
      titre: 'Support de cours PDF',
      derniereModif: {date: '2025-06-18T11:15:00'},
      utilisateur_id_id: 1,
      utilisateur_id_prenom: 'Thomas',
      utilisateur_id_nom: 'Martin',
      contenuFichier: 'cours-avance.pdf',
      typePublicationId: {id: 2}, // file
      visible: true,
      section_id: 0
    }
  ];

  listeSections: Section[] = [
    {
      id: 1,
      nom: 'Section 1'
    },
    {
      id: 2,
      nom: 'Section 2'
    },
    {
      id: 3,
      nom: 'Section 3'
    }
  ];

  listePublications: Publication[] = [
    {
      id: 1,
      titre: 'Chapitre 1 - Introduction',
      derniereModif: {date: '2025-06-20T14:30:00'},
      utilisateur_id_id: 1,
      utilisateur_id_prenom: 'Thomas',
      utilisateur_id_nom: 'Martin',
      contenuTexte: 'Bienvenue dans le cours. Voici le plan de la semaine.',
      typePublicationId: {id: 5}, // info
      visible: true,
      section_id: 0
    },
    {
      id: 2,
      titre: 'TD à remettre',
      derniereModif: {date: '2025-06-19T09:00:00'},
      utilisateur_id_id: 2,
      utilisateur_id_prenom: 'Alice',
      utilisateur_id_nom: 'Dupont',
      contenuTexte: 'Merci de rendre le TD avant vendredi.',
      typePublicationId: {id: 4}, // warning
      visible: true,
      section_id: 0
    },
    {
      id: 3,
      titre: 'Support de cours PDF',
      derniereModif: {date: '2025-06-18T11:15:00'},
      utilisateur_id_id: 1,
      utilisateur_id_prenom: 'Thomas',
      utilisateur_id_nom: 'Martin',
      contenuFichier: 'cours-avance.pdf',
      typePublicationId: {id: 2}, // file
      visible: true,
      section_id: 0
    },
    {
      id: 4,
      titre: 'Support de cours JPG',
      derniereModif: {date: '2025-06-18T11:15:00'},
      utilisateur_id_id: 1,
      utilisateur_id_prenom: 'Thomas',
      utilisateur_id_nom: 'Martin',
      contenuFichier: 'cours-avance.pdf',
      typePublicationId: {id: 2}, // file
      visible: true,
      section_id: 0
    }
  ];

  listeEpinglesIds: number[] = [1, 2, 3]

  // Comportement des popup
  // add section
  isAddSectionModalOpen = false;

  openAddSectionModal() {
    this.isAddSectionModalOpen = true;
  }

  closeAddSectionModal() {
    this.isAddSectionModalOpen = false;
  }

  // modal liste profs/eleves
  showUserListModal = false;
  selectedUserType: 'eleves' | 'professeurs' = 'eleves';

  listeEleves = [
    {
      nom: "Dupont",
      prenom: "Paul",
      photo: "https://i.pinimg.com/736x/f2/a8/be/f2a8bef42b2608a394cb86c2637d78fc.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    },
    {
      nom: "Martin",
      prenom: "Sophie",
      photo: "https://i.pinimg.com/736x/37/5c/2f/375c2fd286cdc41c06764f91f708a687.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    },
    {
      nom: "Lemoine",
      prenom: "Louis",
      photo: "https://i.pinimg.com/736x/37/5c/2f/375c2fd286cdc41c06764f91f708a687.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    }
  ];

  listeProfs = [
    {
      nom: "Durand",
      prenom: "Claire",
      photo: "https://i.pinimg.com/736x/37/5c/2f/375c2fd286cdc41c06764f91f708a687.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    },
    {
      nom: "Robert",
      prenom: "Julien",
      photo: "https://i.pinimg.com/736x/37/5c/2f/375c2fd286cdc41c06764f91f708a687.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    },
    {
      nom: "Bernard",
      prenom: "Isabelle",
      photo: "https://i.pinimg.com/736x/37/5c/2f/375c2fd286cdc41c06764f91f708a687.jpg",
      email: "mhammed.mechroubi@utbm.fr",
    }
  ];

  openUserListModal(type: 'eleves' | 'professeurs') {
    this.selectedUserType = type;
    this.showUserListModal = true;
  }

  closeUserListModal() {
    this.showUserListModal = false;
    this.selectedUserType = "eleves";
  }

  sectionDevoirs = [
    {
      id: 1,
      titre: 'Devoir 1 : Analyse de texte',
      description: 'Lire et analyser le chapitre 3 du livre.',
      date_limite: '2025-07-01T23:59:59'
    },
    {
      id: 2,
      titre: 'Devoir 2 : Résolution d’équations',
      description: 'Résoudre les exercices 5 à 10.',
      date_limite: '2025-07-10T23:59:59'
    }
  ];
}



