import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {PublicationComponent} from '../publication/publication.component';
import {DevoirComponent} from '../devoir/devoir.component';
import {AuthService} from '../../../../core/services/auth.service';


export interface objectSec{
  section: Section;
  publication: Publication;
}

@Component({
  selector: 'app-section',
  imports: [
    PublicationComponent,  DevoirComponent
  ],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})


export class SectionComponent implements OnInit{
  @Input() section!: Section;

  @Output() openAddPubliModal = new EventEmitter();
  @Output() editSectionModal = new EventEmitter();
  @Output() deleteSectionModal = new EventEmitter();

  @Output() deletePublicationModal = new EventEmitter<objectSec>();
  @Output() editPublicationModal = new EventEmitter<objectSec>();

  publications!: Publication[];
  roles!: string[];
  sectionDevoirs: any[] = [];

  constructor(public authService :  AuthService) {
  }


  ngOnInit() {
    if(this.section){
      this.publications = this.section.publications;
      this.sectionDevoirs = this.section.devoirs;
    }
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
