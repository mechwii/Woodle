import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  imageUrl!:string;

  constructor(public imageserv: ImageService) {
  }

  ngOnInit() : void {
    this.imageserv.getImageURL('mhammed.jpeg').subscribe(res => {
      this.imageUrl = res;
    })

  }

}
