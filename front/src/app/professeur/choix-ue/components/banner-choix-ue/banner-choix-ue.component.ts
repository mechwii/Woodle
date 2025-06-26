import {Component, Input} from '@angular/core';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';

@Component({
  selector: 'app-banner-choix-ue',
  imports: [],
  templateUrl: './banner-choix-ue.component.html',
  styleUrl: './banner-choix-ue.component.css'
})
export class BannerChoixUeComponent {

  @Input() utilisateur!: Utilisateur;

  rolesToLabel(roles: string[]): string[] {
    return roles.map(role => {
      switch (role) {
        case 'ROLE_ELEVE':
          return 'Élève';
        case 'ROLE_ADMINISTRATEUR':
          return 'Administrateur';
        case 'ROLE_PROFESSEUR':
          return 'Professeur';
        default:
          return role;
      }
    });
  }
}
