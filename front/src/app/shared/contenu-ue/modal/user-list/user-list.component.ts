import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgStyle} from '@angular/common';
import {Utilisateur} from '../../../../core/models/user.model';
import {ImageService} from '../../../../core/services/image.service';

@Component({
  selector: 'app-user-list',
  imports: [
    NgStyle
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
  @Input() type!: 'eleves' | 'professeurs';
  @Input() eleves: Utilisateur[] = [];
  @Input() professeurs: Utilisateur[] = [];
  @Input() isElevesSelected = true;

constructor(private imageService : ImageService) {
}

  ngOnInit() {
    if(this.eleves){
     this.eleves.forEach(eleve => {
       if(!this.utilisateurs_image[eleve.id_utilisateur]){
         this.imageService.getImageURL(eleve.image, 'profile').subscribe(image => {
           this.utilisateurs_image[eleve.id_utilisateur] = image;
         })
       }
     })
    }
    if(this.professeurs){
      this.professeurs.forEach(prof => {
        if(!this.utilisateurs_image[prof.id_utilisateur]){
          this.imageService.getImageURL(prof.image, 'profile').subscribe(image => {
            this.utilisateurs_image[prof.id_utilisateur] = image;
          })
        }
      })
    }
  }

  @Output() close = new EventEmitter<void>();
  utilisateurs_image: string[] = [];

  onClose() {
    this.close.emit();
  }

  get label() {
    return this.isElevesSelected ? 'Élèves associés' : 'Professeurs associés';
  }

  // var concernant les boutons switch au dessus

  selectEleves() {
    this.isElevesSelected = true;
  }

  selectProfs() {
    this.isElevesSelected = false;
  }
}
