import { Component } from '@angular/core';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarComponent, RouterOutlet, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isCollapsed: boolean = true;

  ToggleContainer(): void {
    console.log('ToggleContainer');
    this.isCollapsed = !this.isCollapsed;
  }

}
