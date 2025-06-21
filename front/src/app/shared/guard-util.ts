import { Router } from '@angular/router';
import {AuthService} from '../core/services/auth.service';

export class GuardUtils {
  static redirectToUserDashboard(authService: AuthService, router: Router) {
    if (authService.isAdmin()) {
      return router.createUrlTree(['/admin']);
    }

    if (authService.isProfesseur()) {
      return router.createUrlTree(['/professeur']);
    }

    if (authService.isEtudiant()) {
      return router.createUrlTree(['/etudiant']);
    }

    return router.createUrlTree(['/login']);
  }
}
