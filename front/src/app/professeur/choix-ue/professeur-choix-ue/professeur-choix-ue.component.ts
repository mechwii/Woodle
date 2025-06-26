import { Component } from '@angular/core';
import {Utilisateur} from '../../../core/models/temp-utilisateur.model';
import {BannerChoixUeComponent} from '../components/banner-choix-ue/banner-choix-ue.component';
import {ActualitesComponent} from '../components/actualites/actualites.component';
import {NotificationSite} from '../../../core/models/temp-notification.model';
import {ListeCoursComponent} from '../components/liste-cours/liste-cours.component';
import {UniteEnseignement} from '../../../core/models/temp-ue.model';

@Component({
  selector: 'app-professeur-choix-ue',
  imports: [
    BannerChoixUeComponent,
    ActualitesComponent,
    ListeCoursComponent
  ],
  templateUrl: './professeur-choix-ue.component.html',
  styleUrl: './professeur-choix-ue.component.css'
})
export class ProfesseurChoixUeComponent {
  utilisateur: Utilisateur = {
    id: 1,
    nom: 'Martin',
    prenom: 'Thomas',
    roles: ['PROFESSEUR'],
    image: "https://wallpapercave.com/wp/wp12469232.jpg",
  }

  mesNotifications: NotificationSite[] = [
    {
      id_notification: 1,
      type_notification_id: 1,
      priorite_id: 2,
      url_destination: '/cours/123',
      nom: 'Nouvelle affectation',
      contenu: 'Vous avez été affecté au cours',
      code_id: 'UE101'
    },
    {
      id_notification: 2,
      type_notification_id: 2,
      priorite_id: 2,
      url_destination: '/cours/123',
      nom: 'Nouvelle inspection',
      contenu: 'Vous avez été affecté au cours',
      code_id: 'UE101'
    },
    {
      id_notification: 3,
      type_notification_id: 5,
      priorite_id: 2,
      url_destination: '/cours/123',
      nom: 'Nouvelle affectation',
      contenu: 'Vous avez été affecté au cours',
      code_id: 'UE101'
    },
  ];

  ues: UniteEnseignement[] = [
    {
      "nom": "Programmation Web Nuancée",
      "id": "IA41",
      "responsable": "Dr. Alice Dupont",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Développement Mobile",
      "id": "IA42",
      "responsable": "M. Marc Lefevre",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Bases de Données",
      "id": "IA43",
      "responsable": "Mme. Claire Martin",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Intelligence Artificielle",
      "id": "IA44",
      "responsable": "Dr. Jean-Luc Bernard",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Sécurité Informatique",
      "id": "IA45",
      "responsable": "M. François Dupuis",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Algorithmes et Structures de Données",
      "id": "IA46",
      "responsable": "Mme. Sophie Rousseau",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Développement d'Applications Web",
      "id": "IA47",
      "responsable": "M. Paul Garnier",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Programmation Orientée Objet",
      "id": "IA48",
      "responsable": "Dr. Julien Dufresne",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Big Data et Cloud Computing",
      "id": "IA49",
      "responsable": "Mme. Virginie Lemoine",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Programmation Orientée Objet",
      "id": "IA48",
      "responsable": "Dr. Julien Dufresne",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Big Data et Cloud Computing",
      "id": "IA49",
      "responsable": "Mme. Virginie Lemoine",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Programmation Orientée Objet",
      "id": "IA48",
      "responsable": "Dr. Julien Dufresne",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Big Data et Cloud Computing",
      "id": "IA49",
      "responsable": "Mme. Virginie Lemoine",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Programmation Orientée Objet",
      "id": "IA48",
      "responsable": "Dr. Julien Dufresne",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    },
    {
      "nom": "Big Data et Cloud Computing",
      "id": "IA49",
      "responsable": "Mme. Virginie Lemoine",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yMDWK2Z6FlMTLLduzr-KlRtSxPsrjsK73Q&s"
    }
  ]



}
