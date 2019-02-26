import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user.model';
import { IQueryParams } from '../other/query-params.interface';
import { RequestQueryBuilder } from '../other/search-query-builder';

const API_USER_AUTH_ENTRY_POINT_URL:string = 'http://localhost:8080/'
const API_USER_AUTH_SESSION_JWT:string = 'Spring.Api.Booking.Session.JWT'

@Injectable()
export class AuthService {

  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  authenticatedUser:User;

  constructor(private router: Router
            , private http: Http) {
  }

  signUp(username: string, password: string): void {
    this.authDidFail.next(false);
    this.authIsLoading.next(true);

    const signupUser = {
      username: username,
      password: password
    };

    console.log('call singup...' + JSON.stringify(signupUser));

    this.http.post(API_USER_AUTH_ENTRY_POINT_URL + 'users/sign-up' , signupUser, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
    .map(
      (response: Response) => response.json()
    )
    .subscribe(
        (data:User) => {
          console.log('signup success');
          this.authenticatedUser = data;

          this.authDidFail.next(false);
          this.authIsLoading.next(false);
        },
        (error) => {
          console.log('signup error' + JSON.stringify(error));
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          }
      );
    return;
  }

  signIn(username: string, password: string): void {
    this.authDidFail.next(false);
    this.authIsLoading.next(true);

    const signinUser = {
      username: username,
      password: password
    };

    console.log('call signin...' + JSON.stringify(signinUser));

    this.http.post(API_USER_AUTH_ENTRY_POINT_URL + 'login' , signinUser, {
      withCredentials: true,
      headers: new Headers({'Content-Type': 'application/json', 'observe': 'response'})
    })
      .subscribe(
        (result: Response) => {
          console.log('signin success' + JSON.stringify(result));

          this.storeTokenToLocal(result.headers.get('Authorization'));

          this.authDidFail.next(false);
          this.authIsLoading.next(false);
        },
        (error) => {
          console.log('signin error' + JSON.stringify(error));

          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          }
      );
    this.authStatusChanged.next(true);
    return;
  }

  logout() {
    this.disposeTokenFromLocal();
    this.authenticatedUser = null;
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const obs = Observable.create((observer) => {
      if (!this.getAuthenticatedUser()) {
        observer.next(false);
      } else {
        if (this.isLoggedIn()) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      }
      observer.complete();
    });
    return obs;
  }

  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }

  // トークンがあり、有効期限が切れていなければログイン状態とみなす
  isLoggedIn(): boolean {
    return !this.isLoggedOut;
  }

  // トークンがないか、有効期限が切れていたらログアウト状態とみなす
  isLoggedOut(): boolean {
    if (!this.token) {
      return true;
    } else {
      const payLoad: { sub: string, exp: number } = JSON.parse(window.atob(this.token.split('.')[1]));
      const expireSec = payLoad.exp;
      return expireSec < new Date().getTime() / 1000;
    }
  }

  getAuthenticatedUser() {
    return this.authenticatedUser
  }

  get token(): string {
   return this.getTokenFromLocal();
  }

  private getTokenFromLocal(): string {
    const token = localStorage.getItem(API_USER_AUTH_SESSION_JWT);
    return token ? token : null;
  }

  private storeTokenToLocal(token: string) {
    localStorage.setItem(API_USER_AUTH_SESSION_JWT, token);
  }

  private disposeTokenFromLocal() : void {
    localStorage.removeItem(API_USER_AUTH_SESSION_JWT);
  }

}
