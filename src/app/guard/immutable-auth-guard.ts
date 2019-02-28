import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../user/auth.service';

@Injectable()
export class ImmutableAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean>
    | boolean {
    console.log('ImmutableAuthGuard::isAuthenticated->' + this.authService.isAuthenticated);
    if(this.authService.isAuthenticated) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

}
