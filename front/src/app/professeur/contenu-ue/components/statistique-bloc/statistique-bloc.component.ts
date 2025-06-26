import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  @Output() blocClick = new EventEmitter<'eleves' | 'professeurs'>();

  onClick() {
    this.blocClick.emit(this.type);
  }
}
