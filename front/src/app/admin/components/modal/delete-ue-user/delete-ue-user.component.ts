import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-delete-ue-user',
  imports: [],
  templateUrl: './delete-ue-user.component.html',
  styleUrl: './delete-ue-user.component.css'
})
export class DeleteUeUserComponent {

  @Input() mode!: string;

}
