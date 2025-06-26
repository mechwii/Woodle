import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Utilisateur} from '../../../../core/models/user.model';
import {UE} from '../../../../core/models/ue.model';
import {ImageService} from '../../../../core/services/image.service';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-delete-ue-user',
  imports: [],
  templateUrl: './delete-ue-user.component.html',
  styleUrl: './delete-ue-user.component.css'
})
export class DeleteUeUserComponent implements OnInit, OnChanges {


  @Input() mode!: string;
  @Output() closePopupSignal = new EventEmitter();
  @Output() shouldUpdate = new EventEmitter();

  @Input() user?: Utilisateur;
  @Input() ue? : UE;




  constructor(private elementRef: ElementRef, private imageService : ImageService, private userService : UtilisateurService, private ueService : UeService) { }


  realImageUser!: string;
  realImageUE!: string;


  ngOnInit() {
    if(this.user){

      this.imageService.getImageURL(this.user.image, 'profile').subscribe(image => {
        this.realImageUser = image;
      })

    } else if(this.ue){
      this.imageService.getImageURL(this.ue.images.nom_original, 'ue').subscribe(image => {
        this.realImageUE = image;
      })

    }
  }

  ngOnChanges() {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  closePopup() {
    // Logique pour fermer la popup (ex: masquer via service ou classe CSS)
    this.closePopupSignal.emit();
  }

  deleteUser(){

    if(this.user){
      this.imageService.remove(this.user.image, 'profile').subscribe(image => {
        console.log(image);
      })

      this.userService.deleteUser(this.user.id_utilisateur).subscribe({
        next: ()=> {
          this.shouldUpdate.emit();
          this.closePopup();
        }, error: (e) => {
          console.error(e);

        }
      })
    }

  }

  deleteUE() {
    if(this.ue){
      this.imageService.remove(this.ue.images.nom_original, 'ue').subscribe(image => {
        console.log(image);
      })

      this.ueService.deleteUE(this.ue.code).subscribe({
        next: ()=> {
          this.shouldUpdate.emit();
          this.closePopup();
        }, error: (e) => {
          console.error(e);

        }
      })
    }


  }

}
