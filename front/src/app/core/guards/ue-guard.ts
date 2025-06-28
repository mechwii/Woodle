import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UeService} from '../services/ue.service';
import {catchError, map, of} from 'rxjs';
import {UE, UeResponse} from '../models/ue.model';

export const ueGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const ueService = inject(UeService);
  const codeUe = route.paramMap.get('code');
  const userId = authService.getIdUser();
  const router = inject(Router);

  return ueService.getAllUeForUserId(userId, 'simplify').pipe(
    map((response: UeResponse) => {
      const ues = response as UE[];
      if( ues.some(ue => ue.code === codeUe)){
        return true;
      } else {
        return router.createUrlTree([authService.isEtudiant() ? 'etudiant' : 'professeur', 'choix-ue']);
      }
    }),
    catchError((err) => {
      console.error('Guard UE — erreur API :', err);
      return of(false);
    })
  );
};
