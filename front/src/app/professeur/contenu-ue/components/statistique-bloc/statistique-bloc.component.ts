import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-statistique-bloc',
  imports: [
    NgClass
  ],
  templateUrl: './statistique-bloc.component.html',
  styleUrl: './statistique-bloc.component.css'
})
export class StatistiqueBlocComponent {
  @Input() label = '';
  @Input() valeur: number = 0;
  @Input() type: 'eleves' | 'professeurs' = 'eleves';

  onClick() {
    console.log(`Clique sur ${this.type}`);
  }
}
