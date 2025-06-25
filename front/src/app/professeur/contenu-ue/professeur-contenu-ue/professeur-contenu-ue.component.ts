import { Component } from '@angular/core';
import {BannerUeComponent} from '../components/banner-ue/banner-ue.component';
import {StatistiqueBlocComponent} from '../components/statistique-bloc/statistique-bloc.component';

@Component({
  selector: 'app-professeur-contenu-ue',
  imports: [
    BannerUeComponent,
    StatistiqueBlocComponent

  ],
  templateUrl: './professeur-contenu-ue.component.html',
  styleUrl: './professeur-contenu-ue.component.css'
})
export class ProfesseurContenuUeComponent {
  nbElevesUe = 123;     // data for stats ue eleve
  nbProfsUe = 5;         // data for stats ue prof
}
