import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../user/auth.service';

@Injectable()
export class ImmutableAuthGuard implements CanActivate {

  isAuthenticated = false;

  constructor(private authService: AuthService,
              private router: Router) {

    this.authService.isAuthenticated.subscribe(
      (authenticated) => {
        console.log('ImmutableAuthGuard.isAuthenticated ->' + authenticated);
        this.isAuthenticated = authenticated;
      }
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean>
    | boolean {
    console.log('ImmutableAuthGuard::isAuthenticated->' + this.isAuthenticated);
    if(this.isAuthenticated) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

}
