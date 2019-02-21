import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { BookingData } from '../model/booking-data.model';
//import { AuthService } from '../user/auth.service';
//import { StepFunctions } from 'aws-sdk';
import { Session } from 'protractor';

const SESSION_JWT_TOKEN:string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaWtvIiwiZXhwIjoxNTUwOTk3MjcxfQ.O9CsDYTD6YkKVz3hvaCMbvoVE6mW9vhE48mDJiV9CnW_Ikig1V4vsGK89TqtM03nwEvBuFxTqLdsR4j2wsLXGA';
const API_ENTRY_POINT_URL:string = 'http://localhost:8080/api/v1/'

@Injectable()
export class BookingService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<BookingData[]>();
  dataLoadFailed = new Subject<boolean>();
  bookingData: BookingData;
  // constructor(private http: Http,
  //             private authService: AuthService) {
  constructor(private http: Http) {
    console.log('call bookingService constructor...')
  }

  onStoreData(bookingData: BookingData) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);
    this.bookingData = bookingData;
//    this.authService.getAuthenticatedUser().getSession((err, session) => {
      // if (err) {
      //   return;
      // }
      this.http.post(API_ENTRY_POINT_URL + 'customers/301/bookings/', bookingData, {
        headers: new Headers({'Authorization': SESSION_JWT_TOKEN})
      })
        .subscribe(
          (result) => {
            this.dataLoadFailed.next(false);
            this.dataIsLoading.next(false);
            this.dataEdited.next(true);
          },
          (error) => {
            this.dataIsLoading.next(false);
            this.dataLoadFailed.next(true);
            this.dataEdited.next(false);
          }
        );
    // });
  }

  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    // this.authService.getAuthenticatedUser().getSession((err, session) => {
      // const queryParam = '?accessToken=' + SESSION_JWT_TOKEN;
      // let urlParam = 'all';
      // if (!all) {
      //   urlParam = 'single';
      // }
      console.log('call onRetrieveData...')
      this.http.get(API_ENTRY_POINT_URL + 'customers/301/bookings/', {
        headers: new Headers({'Authorization': SESSION_JWT_TOKEN})
      })
        .map(
          (response: Response) => response.json()
        )
        .subscribe(
          (data) => {
            if (all) {
              console.log(data);
              this.dataLoaded.next(data);
            } else {
              console.log(data);
              if (!data) {
                this.dataLoadFailed.next(true);
                return;
              }
              this.bookingData = data[0];
              this.dataEdited.next(true);
            }
          },
          (error) => {
            this.dataLoadFailed.next(true);
            this.dataLoaded.next(null);
          }
        );
    // });
  }

  onDeleteData() {
    this.dataLoadFailed.next(false);
    // this.authService.getAuthenticatedUser().getSession((err, session) => {
      this.http.delete(API_ENTRY_POINT_URL + 'customers/301/bookings/60', {
        headers: new Headers({'Authorization': SESSION_JWT_TOKEN})
      })
        .subscribe(
          (data) => {
            console.log(data);
          },
          (error) => this.dataLoadFailed.next(true)
        );
    // });
  }
}
