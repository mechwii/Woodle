import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';
import {UE} from '../../../core/models/ue.model';

@Component({
  selector: 'app-ue',
  imports: [],
  templateUrl: './ue.component.html',
  styleUrl: './ue.component.css'
})
export class UeComponent implements OnInit {
  /*@Input() code!: string;
  @Input() responsable!: string;
  @Input() responsable_id!: number;
  @Input() nom_ue! : string;
  @Input() image_url!: string;*/

  @Input() ue! : UE;
  image_realUrl!: string;


  @Output() openEditPopup = new EventEmitter();
  @Output() openDeletePopup = new EventEmitter();

  constructor(private imageService : ImageService) {
  }

  ngOnInit() {
    this.imageService.getImageURL(this.ue.image, 'ues').subscribe( (result) => {
      this.image_realUrl = result;
    })

  }

  openEditModal () : void {
    this.openEditPopup.emit();
  }

  openDeleteModal () : void {
    this.openDeletePopup.emit();
  }


}
