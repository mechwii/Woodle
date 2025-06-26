import {Component, Input} from '@angular/core';

// import des models
import { Utilisateur } from '../../../../core/models/temp-utilisateur.model';
import { Publication } from '../../../../core/models/temp-publication.model';
import {UniteEnseignement} from '../../../../core/models/temp-ue.model';
import {
  PublicationEpingleeComponent
} from '../publication-epinglee/publication-epinglee.component';

@Component({
  selector: 'app-epingles',
  standalone: true,
  imports: [
    PublicationEpingleeComponent
  ],
  templateUrl: './epingles.component.html',
  styleUrl: './epingles.component.css'
})
export class EpinglesComponent {
  @Input() epingles!: Publication[];
  @Input() utilisateur!: Utilisateur;

  get utilisateurId(): number {
    return this.utilisateur.id;
  }
}
