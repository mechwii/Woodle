import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthServiceService} from '../services/auth.service.service';
import {GuardUtils} from '../../shared/guard-util';


export const guestOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  if(!authService.isLoggedIn()){
    return true;
  } else {
    return GuardUtils.redirectToUserDashboard(authService, router);
  }
};
