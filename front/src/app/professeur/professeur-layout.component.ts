import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-professeur-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './professeur-layout.component.html',
  styleUrl: './professeur-layout.component.css'
})
export class ProfesseurLayoutComponent {

  isCollapsed: boolean = true;

  ToggleContainer(): void {
    console.log('ToggleContainer');
    this.isCollapsed = !this.isCollapsed;
  }

}
