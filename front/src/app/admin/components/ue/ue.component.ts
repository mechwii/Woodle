import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';

@Component({
  selector: 'app-ue',
  imports: [],
  templateUrl: './ue.component.html',
  styleUrl: './ue.component.css'
})
export class UeComponent implements OnInit {
  @Input() code!: string;
  @Input() responsable!: string;
  @Input() responsable_id!: number;
  @Input() nom_ue! : string;
  @Input() image_url!: string;
  image_realUrl!: string;

  constructor(private imageService : ImageService) {
  }

  ngOnInit() {
    this.imageService.getImageURL(this.image_url, 'ues').subscribe( (result) => {
      this.image_realUrl = result;
    })

  }


}
