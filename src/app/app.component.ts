import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './user/auth.service';
import { User } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.authService.initAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get user(): User {
    return this.authService.getAuthenticatedUser();
  }
}
