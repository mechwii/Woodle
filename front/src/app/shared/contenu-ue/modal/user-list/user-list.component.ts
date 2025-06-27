import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [
    NgStyle
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @Input() type!: 'eleves' | 'professeurs';
  @Input() eleves: any[] = [];
  @Input() professeurs: any[] = [];
  @Input() isElevesSelected = true;


  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  get label() {
    return this.isElevesSelected ? 'Élèves associés' : 'Professeurs associés';
  }

  // var concernant les boutons switch au dessus

  selectEleves() {
    this.isElevesSelected = true;
  }

  selectProfs() {
    this.isElevesSelected = false;
  }
}
