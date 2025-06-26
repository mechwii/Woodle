import {Component, EventEmitter, Input, Output} from '@angular/core';

// import des models
import { Utilisateur } from '../../../../core/models/temp-utilisateur.model';

@Component({
  selector: 'app-interactions-sections-bloc',
  imports: [],
  templateUrl: './interactions-sections-bloc.component.html',
  styleUrl: './interactions-sections-bloc.component.css'
})
export class InteractionsSectionsBlocComponent {
  @Input() utilisateur!: Utilisateur;
  @Output() addSectionClick = new EventEmitter<void>();

  onAddSectionClick() {
    this.addSectionClick.emit();
  }
}


