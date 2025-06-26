import {Component, Input} from '@angular/core';

// import des models
import { UniteEnseignement } from '../../../../core/models/temp-ue.model';

@Component({
  selector: 'app-banner-ue',
  imports: [],
  templateUrl: './banner-ue.component.html',
  styleUrl: './banner-ue.component.css'
})
export class BannerUeComponent {
  @Input() ue!: UniteEnseignement;
}
