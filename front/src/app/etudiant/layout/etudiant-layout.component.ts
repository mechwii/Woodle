import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-etudiant-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './etudiant-layout.component.html',
  styleUrl: './etudiant-layout.component.css'
})
export class EtudiantLayoutComponent {

  isCollapsed: boolean = true;

  ToggleContainer(): void {
    console.log('ToggleContainer');
    this.isCollapsed = !this.isCollapsed;
  }

}

