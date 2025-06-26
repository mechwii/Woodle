import {Component, Input} from '@angular/core';
import {Section} from '../../../../core/models/section.model';
import {Publication} from '../../../../core/models/temp-publication.model';
import {SectionComponent} from '../section/section.component';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';

@Component({
  selector: 'app-bloc-sections',
  imports: [
    SectionComponent
  ],
  templateUrl: './bloc-sections.component.html',
  styleUrl: './bloc-sections.component.css'
})
export class BlocSectionsComponent {
  @Input() sections!: Section[];
  @Input() publications!: Publication[];
  @Input() roles!: string[];
  @Input() publicationsEpinglesIds!: number[];
  @Input() utilisateurId!: number;
  @Input() utilisateur!: Utilisateur;
  @Input() devoirs!: any[];
}
