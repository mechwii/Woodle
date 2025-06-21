import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {GuardUtils} from '../../shared/guard-util';


export const guestOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(!authService.isLoggedIn()){
    return true;
  } else {
    return GuardUtils.redirectToUserDashboard(authService, router);
  }
};
