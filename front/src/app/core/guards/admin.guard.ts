import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthServiceService} from '../services/auth.service.service';
import {GuardUtils} from '../../shared/guard-util';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  if(authService.isAdmin()){
    return true;
  } else {
    return GuardUtils.redirectToUserDashboard(authService, router);
  }
};
