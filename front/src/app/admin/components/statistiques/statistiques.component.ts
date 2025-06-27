import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-statistiques',
  imports: [],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.css'
})
export class StatistiquesComponent {
  @Input() section_name! : string;
  @Input() statistique_number! : number;
  @Input() icon!: string;

}
