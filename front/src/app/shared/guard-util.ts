import { Router } from '@angular/router';
import {AuthServiceService} from '../core/services/auth.service.service';

export class GuardUtils {
  static redirectToUserDashboard(authService: AuthServiceService, router: Router) {
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
