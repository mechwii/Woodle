import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-professeur-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './professeur-layout.component.html',
  styleUrl: './professeur-layout.component.css'
})
export class ProfesseurLayoutComponent {

  utilisateur = {
    id: 1,
    nom: 'Martin',
    prenom: 'Thomas',
    roles: ['PROFESSEUR']
  }

}
