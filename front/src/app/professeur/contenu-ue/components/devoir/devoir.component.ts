import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-devoir',
  imports: [
    DatePipe
  ],
  templateUrl: './devoir.component.html',
  styleUrl: './devoir.component.css'
})
export class DevoirComponent {
  @Input() devoir!: {
    id: number;
    titre: string;
    description: string;
    date_limite: string;
  };

  onVoirDepots() {
    console.log('Voir les dépôts pour le devoir :', this.devoir.id);
    // TODO: Navigation ou modal pour afficher les dépôts
  }
}
