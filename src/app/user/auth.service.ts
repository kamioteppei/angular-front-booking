import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user.model';
import { CustomerData } from '../model/customer-data.model';
import * as constant from '../app-constant';

@Injectable()
export class AuthService {

  authIsLoading = new Subject<boolean>();
  authDidFail = new Subject<boolean>();
  // isAuthenticated = new Subject<boolean>();
  private _isAuthenticated: boolean;
  private authenticatedUser:User;
  private _pathFrom:string;
  private _pathTo:string;

  get isAuthenticated(){
    return this._isAuthenticated;
  }
  get pathFrom(){
    return this._pathFrom;
  }
  get pathTo(){
    return this._pathTo;
  }

  constructor(private router: Router
            , private http: Http) {
  }

  initAuth() {
    this.authenticattionObservable().subscribe(
      (auth:boolean) => {
        console.log('this.authenticattionObserver -> ' + auth )
        if (!auth){
          this.logout;
        }
    });
  }

  signUp(username: string, password: string): void {
    this.authIsLoading.next(true);

    const signupUser = {
      username: username,
      password: password
    };

    console.log('call singup...' + JSON.stringify(signupUser));

    this.http.post(constant.API_USER_AUTH_ENTRY_POINT_URL + 'users/sign-up' , signupUser, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
    .subscribe(
        (response: Response) => {
          console.log('signup success' + JSON.stringify(response));
          this.signIn(username, password);
        },
        (error) => {
          console.log('signup error' + JSON.stringify(error));
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          this.logout;
        }
      );
      return;
  }

  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);

    const signinUser = {
      username: username,
      password: password
    };

    console.log('call signin...' + JSON.stringify(signinUser));

    this.http.post(constant.API_USER_AUTH_ENTRY_POINT_URL + 'login' , signinUser, {
      withCredentials: true,
      headers: new Headers({'Content-Type': 'application/json', 'observe': 'response'})
    })
      .subscribe(
        (result: Response) => {
          console.log('signin success' + JSON.stringify(result));
          const token = result.headers.get('Authorization');

          console.log('call getCustomerByName...')
          this.http.get(constant.API_DOMAIN_ENTRY_POINT_URL + 'customers/' + username, {
            headers: new Headers({'Authorization': token})
          })
          .map(
            (response: Response) => response.json()
          )
          .subscribe(
              (customer: CustomerData) => {
                console.log('getCustomer success ->' + customer);
                const authenticatedUser = {
                  id: customer.id,
                  username: customer.name,
                  password: null
                }
                this.authDidFail.next(false);
                this.authIsLoading.next(false);
                this.login(authenticatedUser, token)
              },
              (error) => {
                console.log('getCustomer error' + JSON.stringify(error));
                this.authDidFail.next(true);
                this.authIsLoading.next(false);
                this.logout
              }
          );
        },
        (error) => {
          console.log('signin error' + JSON.stringify(error));
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          this.logout;
        }
      );
    return;
  }

  login(user:User, token:string) {
    this.authenticatedUser = user;
    this.storeTokenToLocal(token);
    this._isAuthenticated = true;
  }

  logout() {
    this.authenticatedUser = null;
    this.disposeTokenFromLocal();
    this._isAuthenticated = false;
  }

  authenticattionObservable(): Observable<boolean> {
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

  // Observerの外だしサンプルとしてコメントアウト状態で残す
  // 外だししても、上位の変数の参照ができなくなるので、やめた
  // onGetCustomerResponsObserver = {
  //   next: (customer: CustomerData) => {
  //     console.log('getCustomer success ->' + customer);
  //     this.authenticatedUser = {
  //       id: customer.id,
  //       username: customer.name,
  //       password: null
  //     }
  //     this.authDidFail.next(false);
  //     this.authIsLoading.next(false);
  //     this.isAuthenticated.next(true);
  //   },
  //   error: (error) => {
  //     console.log('getCustomer error' + JSON.stringify(error));
  //     this.authDidFail.next(true);
  //     this.authIsLoading.next(false);
  //     this.isAuthenticated.next(false);
  //   }
  // }

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

  pathThroughAuth(pathFrom:string, pathTo:string){
    this._pathFrom = null;
    this._pathTo = null;

    this._pathFrom = pathFrom;
    this._pathTo = pathTo;
  }

  getAuthenticatedUser() {
    return this.authenticatedUser
  }

  get token(): string {
   return this.getTokenFromLocal();
  }

  private getTokenFromLocal(): string {
    const token = localStorage.getItem(constant.API_USER_AUTH_SESSION_JWT);
    return token ? token : null;
  }

  private storeTokenToLocal(token: string) {
    localStorage.setItem(constant.API_USER_AUTH_SESSION_JWT, token);
  }

  private disposeTokenFromLocal() : void {
    localStorage.removeItem(constant.API_USER_AUTH_SESSION_JWT);
  }

}
