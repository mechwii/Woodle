import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-ue-user',
  imports: [],
  templateUrl: './delete-ue-user.component.html',
  styleUrl: './delete-ue-user.component.css'
})
export class DeleteUeUserComponent {

  @Input() mode!: string;
  @Output() closePopupSignal = new EventEmitter();


  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  closePopup() {
    // Logique pour fermer la popup (ex: masquer via service ou classe CSS)
    this.closePopupSignal.emit();
  }

}
