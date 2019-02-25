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

@Injectable()
export class AuthService {

  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser:User;

  constructor(private router: Router
            , private http: Http) {
}

  signUp(username: string, password: string): void {
    this.authIsLoading.next(true);
    const signupUser = {
      username: username,
      password: password
    };

    console.log('call onRetrieveData...' + JSON.stringify(signupUser));

    this.http.post(API_USER_AUTH_ENTRY_POINT_URL + 'users/sign-up' , signupUser, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .subscribe(
        (result) => {
          console.log(result);
          this.authDidFail.next(false);
          this.authIsLoading.next(false);
          // this.registeredUser = result.json;
        },
        (error) => {
          console.log(error);
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
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

    this.http.post(API_USER_AUTH_ENTRY_POINT_URL + 'login' , signinUser, {
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .subscribe(
        (result) => {
          console.log(result);
          this.authDidFail.next(false);
          this.authIsLoading.next(false);
          // this.registeredUser = result.json;
        },
        (error) => {
          console.log(error);
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          }
      );
    this.authStatusChanged.next(true);
    return;
  }

  getAuthenticatedUser() {
    return this.registeredUser
  }

  logout() {
    this.registeredUser = null;
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        // user.getSession((err, session) => {
        //   if (err){
        //     observer.next(false);
        //   } else {
        //     if (session.isValid()){
        //       observer.next(true);
        //     } else {
        //       observer.next(false);
        //     }
        //   }
        // });
      observer.next(true);
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
}
