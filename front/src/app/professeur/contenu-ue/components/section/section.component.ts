import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {PublicationComponent} from '../publication/publication.component';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';


export interface objectSec{
  section: Section;
  publication: Publication;
}

@Component({
  selector: 'app-section',
  imports: [
    PublicationComponent
  ],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})


export class SectionComponent implements OnInit, OnChanges{
  @Input() section!: Section;
  @Input() codeUe!: string;

  @Output() openAddPubliModal = new EventEmitter();
  @Output() editSectionModal = new EventEmitter();
  @Output() deleteSectionModal = new EventEmitter();

  @Output() deletePublicationModal = new EventEmitter<objectSec>();
  @Output() editPublicationModal = new EventEmitter<objectSec>();

  publications!: Publication[];
  roles!: string[];
  sectionDevoirs: any[] = [];

  constructor(public authService :  AuthService, private ueService : UeService) {
  }

  loadPublications() {
    this.ueService.getPublicatioBySection(this.codeUe, this.section._id).subscribe({
      next: (pubs) => {
        this.publications = pubs;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications', err);
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
      this.loadPublications();

  }


  ngOnInit() {
    this.loadPublications();
  }


  openEditSectionModal() {
    this.editSectionModal.emit(this.section);
  }

  openDeleteModal() {
    this.deleteSectionModal.emit(this.section);
  }

  openAddPublicationModal() {
    this.openAddPubliModal.emit(this.section);
  }

  openEditPublicationModal(pub: Publication) {
    this.editPublicationModal.emit({publication : pub, section: this.section});
  }

  openDeletePublicationModal(pub: Publication) {
    this.deletePublicationModal.emit({publication : pub, section: this.section});
  }

  openAddDevoirModal() {
    console.log();
  }
}
