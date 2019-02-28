import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../user/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean>
    | boolean {
    console.log('AuthGuard::isAuthenticated->' + this.authService.isAuthenticated);
    if(this.authService.isAuthenticated) {
      return true;
    } else {
      console.log('AuthGuard::isAuthenticated-> navigate signin');
      this.router.navigate(['/signin']);
      return false;
    }
  }

}
