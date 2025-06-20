import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthServiceService} from '../services/auth.service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if(authService.isLoggedIn()){
    return true;
  } else {
    return router.createUrlTree(['login']);
  }
};
