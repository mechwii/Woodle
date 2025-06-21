import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {GuardUtils} from '../../shared/guard-util';

export const etudiantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(authService.isEtudiant()){
    return true;
  } else {
    return GuardUtils.redirectToUserDashboard(authService, router);
  }};
