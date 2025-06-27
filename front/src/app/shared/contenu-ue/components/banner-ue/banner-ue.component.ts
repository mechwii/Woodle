import {Component, Input, OnInit} from '@angular/core';

// import des models
import {UE} from '../../../../core/models/ue.model';

@Component({
  selector: 'app-banner-ue',
  imports: [],
  templateUrl: './banner-ue.component.html',
  styleUrl: './banner-ue.component.css'
})
export class BannerUeComponent {
  @Input() ue!: UE;


}
