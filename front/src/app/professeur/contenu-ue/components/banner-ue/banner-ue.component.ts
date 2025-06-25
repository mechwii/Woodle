import { Component } from '@angular/core';

@Component({
  selector: 'app-banner-ue',
  imports: [],
  templateUrl: './banner-ue.component.html',
  styleUrl: './banner-ue.component.css'
})
export class BannerUeComponent {
  ue: UniteEnseignement = {
    nom: 'Programmation Web Avancée',
    id: 'LE03'
  };
}

interface UniteEnseignement {
  id: string;
  nom: string;
}
