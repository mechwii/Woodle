import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../../core/models/user.model';
import {BannerChoixUeComponent} from '../components/banner-choix-ue/banner-choix-ue.component';
import {ActualitesComponent} from '../components/actualites/actualites.component';
import {NotificationSite} from '../../../core/models/temp-notification.model';
import {ListeCoursComponent} from '../components/liste-cours/liste-cours.component';
import {AuthService} from '../../../core/services/auth.service';
import {UtilisateurService} from '../../../core/services/utilisateur.service';
import {UE} from '../../../core/models/ue.model';
import {UeService} from '../../../core/services/ue.service';

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
export class ProfesseurChoixUeComponent implements OnInit {

  ues!: UE[];
  utilisateur!: Utilisateur;

  constructor(private authService : AuthService, private userService : UtilisateurService, private ueService : UeService) {
  }

  ngOnInit() {
    this.userService.getUserById(this.authService.getIdUser()).subscribe(
      user => {
        this.utilisateur = (user as Utilisateur);

        this.ueService.getAllUeForUserId(this.utilisateur.id_utilisateur, 'admin_data').subscribe(res =>{
          this.ues = (res as UE[]);
        })

      }
    )



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



}
