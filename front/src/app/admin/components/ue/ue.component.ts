import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';
import {UE} from '../../../core/models/ue.model';
import {Utilisateur} from '../../../core/models/user.model';
import {UtilisateurService} from '../../../core/services/utilisateur.service';

@Component({
  selector: 'app-ue',
  imports: [],
  templateUrl: './ue.component.html',
  styleUrl: './ue.component.css'
})
export class UeComponent implements OnInit, OnChanges {
  /*@Input() code!: string;
  @Input() responsable!: string;
  @Input() responsable_id!: number;
  @Input() nom_ue! : string;
  @Input() image_url!: string;*/

  @Input() ue! : UE;
  image_realUrl!: string;
  responsable! : Utilisateur;


  @Output() openEditPopup = new EventEmitter();
  @Output() openDeletePopup = new EventEmitter();

  constructor(private imageService : ImageService, private userService : UtilisateurService) {
  }

  ngOnInit() {
  this.updateImage()
  }

  ngOnChanges() {
    this.updateImage()

  }

  updateImage(): void {
    this.imageService.getImageURL(this.ue.images.nom_original, 'ues').subscribe( (result) => {
      this.image_realUrl = result;
    })


    this.userService.getUserById(this.ue.responsable_id).subscribe( (result) => {
      this.responsable = (result as Utilisateur);
    })

  }

  openEditModal () : void {
    this.openEditPopup.emit(this.ue.code);
  }

  openDeleteModal () : void {
    this.openDeletePopup.emit(this.ue.code);
  }


}
