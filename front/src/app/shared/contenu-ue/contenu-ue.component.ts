import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

// import des models

import {ActivatedRoute} from '@angular/router';
import {UE} from '../../core/models/ue.model';
import {UeService} from '../../core/services/ue.service';
import {objectSec, SectionComponent} from './components/section/section.component';
import {Publication, Section} from '../../core/models/temp-publication.model';

import {BannerUeComponent} from './components/banner-ue/banner-ue.component';
import {StatistiqueBlocComponent} from './components/statistique-bloc/statistique-bloc.component';
import {
  InteractionsSectionsBlocComponent
} from './components/interactions-sections-bloc/interactions-sections-bloc.component';
import {UserListComponent} from './modal/user-list/user-list.component';
import {AddSectionComponent} from './modal/add-section/add-section.component';
import {EditSectionComponent} from './modal/edit-section/edit-section.component';
import {DeleteSectionComponent} from './modal/delete-section/delete-section.component';
import {AddPublicationComponent} from './modal/add-publication/add-publication.component';
import {EditPublicationComponent} from './modal/edit-publication/edit-publication.component';
import {DeletePublicationComponent} from './modal/delete-publication/delete-publication.component';
import {AuthService} from '../../core/services/auth.service';
import {Utilisateur} from '../../core/models/user.model';

@Component({
  selector: 'app-contenu-ue',
  imports: [
    BannerUeComponent,
    StatistiqueBlocComponent,
    InteractionsSectionsBlocComponent,
    AddSectionComponent,
    UserListComponent,
    SectionComponent,
    AddPublicationComponent,
    DeleteSectionComponent,
    EditSectionComponent,
    DeletePublicationComponent,
    EditPublicationComponent,
    BannerUeComponent,
    StatistiqueBlocComponent,
    InteractionsSectionsBlocComponent,
    SectionComponent,
    UserListComponent,
    AddSectionComponent,
    EditSectionComponent,
    DeleteSectionComponent,
    AddPublicationComponent,
    EditPublicationComponent,
    DeletePublicationComponent

  ],
  templateUrl: './contenu-ue.component.html',
  styleUrl: './contenu-ue.component.css'
})
export class ContenuUeComponent implements OnInit {

  uniteEnseignement!: UE;
  isEditSectionModalOpen:boolean =false;
  isDeleteSectionModalOpen:boolean = false;
  showAddPublicationModal:boolean = false;
  currentSection? : Section;

  showEditPublicationModal:boolean = false;
  showDeletePublicationModal:boolean = false;
  currentPublication? : Publication;
  nbElevesUe! : number;
  nbProfsUe! : number;

  // modal liste profs/eleves
  showUserListModal = false;
  selectedUserType: 'eleves' | 'professeurs' = 'eleves';

  listeEleves: Utilisateur[] = []

  listeProfs: Utilisateur[] = [];

  constructor(private activatedroute : ActivatedRoute, private ueService : UeService,private authService : AuthService) {
  }

  ngOnInit() {
    this.ueService.getUeByCode(this.activatedroute.snapshot.params['code'], true, this.authService.getIdUser()).subscribe((ues) => {
      let ue = (ues as UE);
      this.uniteEnseignement = {
        ...ue,
        sections: [...(ue.sections ?? [])]
      };
      this.ueService.getUserInUEByGroup(this.uniteEnseignement.code, 2).subscribe({
        next: value => {
          this.listeProfs = value as Utilisateur[];
          console.log(this.listeProfs);
          this.nbProfsUe = this.listeProfs.length;
        } , error: err => {
          console.error(err);
        }
      })

      this.ueService.getUserInUEByGroup(this.uniteEnseignement.code, 3).subscribe({
        next: value => {
          this.listeEleves = value as Utilisateur[];
          this.nbElevesUe = this.listeEleves.length;
        } , error: err => {
          console.error(err);
        }
      })
    });


  }


  initializeUe() {
    this.ueService.getUeByCode(this.activatedroute.snapshot.params['code']).subscribe((ues) => {
      let ue = (ues as UE);
      this.uniteEnseignement = {
        ...ue,
        sections: [...(ue.sections ?? [])]
      };
    });
  }




  // Comportement des popup
  // add section
  isAddSectionModalOpen = false;

  openAddSectionModal( ) {
    this.isAddSectionModalOpen = true;
  }

  openEditSectionModal(section : any) {
    this.currentSection = section;
    this.isEditSectionModalOpen = true;
  }

  openAddPublicationModal(section : any) {
    this.currentSection = section;
    this.showAddPublicationModal = true;
  }

  openDeleteSectionModal(section : Section) {
    this.currentSection = section;
    this.isDeleteSectionModalOpen = true;
  }

  openEditPublicationModal(publication: objectSec) {
    this.currentPublication = publication.publication;
    this.currentSection = publication.section
    this.showEditPublicationModal = true;
  }

  openDeletePublicationModal(publication : objectSec) {
    this.currentPublication = publication.publication;
    this.currentSection = publication.section;
    this.showDeletePublicationModal = true;
  }

  closeModal() {
    this.isAddSectionModalOpen = false;
    this.isDeleteSectionModalOpen = false;
    this.showAddPublicationModal = false;
    this.isEditSectionModalOpen = false;
    this.showEditPublicationModal = false;
    this.showDeletePublicationModal = false;
  }

  updateAll(){
    setTimeout(() => this.initializeUe(), 200);
    this.closeModal();
    console.log('have to update')
  }

  openUserListModal(type: 'eleves' | 'professeurs') {
    this.selectedUserType = type;
    this.showUserListModal = true;
  }

  closeUserListModal() {
    this.showUserListModal = false;
    this.selectedUserType = "eleves";
  }

  sectionDevoirs = [
    {
      id: 1,
      titre: 'Devoir 1 : Analyse de texte',
      description: 'Lire et analyser le chapitre 3 du livre.',
      date_limite: '2025-07-01T23:59:59'
    },
    {
      id: 2,
      titre: 'Devoir 2 : Résolution d’équations',
      description: 'Résoudre les exercices 5 à 10.',
      date_limite: '2025-07-10T23:59:59'
    }
  ];
}



