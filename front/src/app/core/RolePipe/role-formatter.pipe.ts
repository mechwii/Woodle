import { Pipe, PipeTransform } from '@angular/core';
import {Roles} from '../models/auth.model';

@Pipe({
  name: 'roleFormatter'
})
export class RoleFormatterPipe implements PipeTransform {

  transform(roles: Roles[] = []): string {
    return roles
      .map(role => {
        switch (role.id_role) {
          case 1: return 'Administrateur';
          case 2: return 'Professeur';
          case 3: return 'Étudiant';
          default: return '';
        }
      })
      .filter(label => label)
      .join(' - ');
  }

}
