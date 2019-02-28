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
  isAuthenticated = false;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {

    this.authService.isAuthenticated.subscribe(
      (authenticated) => {
        console.log('authService.authStatusChanged->' + authenticated);
        this.isAuthenticated = authenticated;
        // ログイン画面でエラーになった場合に、ログイン画面で、
        // エラー内容を表示したいので、ここはコメントアウトする
        // if (authenticated) {
        //   this.router.navigate(['/booking']);
        // } else {
        //   this.router.navigate(['/']);
        // }
      }
    );
    this.authService.initAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  get user(): User {
    return this.authService.getAuthenticatedUser();
  }
}
