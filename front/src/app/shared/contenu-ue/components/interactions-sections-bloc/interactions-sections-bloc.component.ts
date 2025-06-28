import {Component, EventEmitter, Input, Output} from '@angular/core';

// import des models
import { Utilisateur } from '../../../../core/models/temp-utilisateur.model';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-interactions-sections-bloc',
  imports: [],
  templateUrl: './interactions-sections-bloc.component.html',
  styleUrl: './interactions-sections-bloc.component.css'
})
export class InteractionsSectionsBlocComponent {
  @Output() addSectionClick = new EventEmitter<void>();

  public constructor(public AuthService: AuthService) {
  }

  onAddSectionClick() {
    this.addSectionClick.emit();
  }

}


