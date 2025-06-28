import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../core/models/user.model';
import {BannerChoixUeComponent} from './components/banner-choix-ue/banner-choix-ue.component';
import {ActualitesComponent} from './components/actualites/actualites.component';
import {ListeCoursComponent} from './components/liste-cours/liste-cours.component';
import {AuthService} from '../../core/services/auth.service';
import {UtilisateurService} from '../../core/services/utilisateur.service';
import {UE} from '../../core/models/ue.model';
import {UeService} from '../../core/services/ue.service';
import {Notifications} from '../../core/models/notifications';
import {NotificationsService} from '../../core/services/notifications.service';

@Component({
  selector: 'app-choix-ue',
  imports: [
    BannerChoixUeComponent,
    ActualitesComponent,
    ListeCoursComponent
  ],

  templateUrl: './choix-ue.component.html',
  styleUrl: './choix-ue.component.css'
})
export class ChoixUeComponent implements OnInit {

  ues!: UE[];
  utilisateur!: Utilisateur;
  mesNotifications!: Notifications[];

  constructor(private authService : AuthService, private notificationsService : NotificationsService, private userService : UtilisateurService, private ueService : UeService) {
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

    this.notificationsService.getNotificationForUser(this.authService.getIdUser()).subscribe(
      res => {
        this.mesNotifications = res;
      }
    )

  }




}
