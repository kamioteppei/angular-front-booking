import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user.model';
import { IQueryParams } from '../other/query-params.interface';
import { RequestQueryBuilder } from '../other/search-query-builder';
import { CustomerData } from '../model/customer-data.model';

const API_USER_AUTH_ENTRY_POINT_URL:string = 'http://localhost:8080/'
const API_ENTRY_POINT_URL:string = 'http://localhost:8080/api/v1/'
const API_USER_AUTH_SESSION_JWT:string = 'Spring.Api.Booking.Session.JWT'

@Injectable()
export class AuthService {

  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new Subject<boolean>();
  isAuthenticated = new Subject<boolean>();
  authenticatedUser:User;

  constructor(private router: Router
            , private http: Http) {
  }

  initAuth() {
    this.authenticattionObserver().subscribe(
      (auth:boolean) => {
        console.log('this.authenticattionObserver -> ' + auth )
        this.isAuthenticated.next(auth);
    });
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
    .subscribe(
        (response: Response) => {
          console.log('signup success' + JSON.stringify(response));
          this.authDidFail.next(false);
          this.authIsLoading.next(false);
        },
        (error) => {
          console.log('signup error' + JSON.stringify(error));
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          }
      );
      this.isAuthenticated.next(false);
      return;
  }

  signIn(username: string, password: string): void {
    // this.authDidFail.next(false);
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

          console.log('call getCustomerByName...')
          this.http.get(API_ENTRY_POINT_URL + 'customers/' + username, {
            headers: new Headers({'Authorization': this.token})
          })
            .map(
              (response: Response) => response.json()
            )
            .subscribe(
              (customer: CustomerData) => {
                  console.log('getCustomer success ->' + customer);
                  this.authenticatedUser = {
                    id: customer.id,
                    username: customer.name,
                    password: null
                  }
                  this.authDidFail.next(false);
                  this.authIsLoading.next(false);
                  this.isAuthenticated.next(true);

              },
              (error) => {
                console.log('getCustomer error' + JSON.stringify(error));
                this.authDidFail.next(true);
                this.authIsLoading.next(false);
                this.isAuthenticated.next(false);
              }
            );
        },
        (error) => {
          console.log('signin error' + JSON.stringify(error));

          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          this.isAuthenticated.next(false);
        }
      );
    return;
  }

  logout() {
    this.disposeTokenFromLocal();
    this.authenticatedUser = null;
    this.isAuthenticated.next(false);
  }

  authenticattionObserver(): Observable<boolean> {
    const obs = Observable.create((observer) => {
      console.log('call isAuthenticated Observable')

      if (!this.getAuthenticatedUser()) {
        console.log('call isAuthenticated user is null')
        this.logout();
        observer.next(false);
      } else {
        if (this.isLoggedIn()) {
          console.log('call isAuthenticated isLoggedIn')
          observer.next(true);
        } else {
          console.log('call isAuthenticated isLoggedOut')
          this.logout();
          observer.next(false);
        }
      }
      observer.complete();
    });
    return obs;
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
