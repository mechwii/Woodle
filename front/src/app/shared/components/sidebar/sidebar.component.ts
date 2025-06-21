import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isToggle: boolean = true;
  @Input() dashbordLink!: string;
  @Output() hasChangeToggle = new EventEmitter<void>();

  constructor(private router: Router) {}

  toggleNav(): void {
    this.isToggle = !this.isToggle;
    console.log("toggle")
    this.hasChangeToggle.emit();
  }

  redirectToDashboard(): void {
    console.log("redirectToDashboard");
    this.router.navigate([this.dashbordLink]);
  }


}
