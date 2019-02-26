import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { BookingData } from '../model/booking-data.model';
import { AuthService } from '../user/auth.service';
import { CustomerData } from '../model/customer-data.model';

// const SESSION_JWT_TOKEN:string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaWtvIiwiZXhwIjoxNTUxODc1NzAzfQ.mc-L9KoLhB84hyvTu4bsMmFlHXDN6ftaJ91G4v2qLvsgv54xSEHUSsof9WDK4FqoNbn2Z3nKja40p8qV2o-MuQ';
const API_ENTRY_POINT_URL:string = 'http://localhost:8080/api/v1/'

@Injectable()
export class BookingService {

  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<BookingData[]>();
  dataLoadFailed = new Subject<boolean>();
  bookingData: BookingData;

  constructor(private http: Http,
              private authService: AuthService) {
  }

  onStoreData(bookingData: BookingData) {

    if (!this.authService.isAuthenticated) {
      return;
    }

    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);

    let customerId: number = bookingData.customer.id;
    this.http.post(API_ENTRY_POINT_URL + 'customers/' + customerId + '/bookings/', bookingData, {
      headers: new Headers({'Authorization': this.authService.token })
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
  }

  onRetrieveData(customerData:CustomerData) {

    if (!this.authService.isAuthenticated) {
      return;
    }

    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);

    console.log('call onRetrieveData...')
    this.http.get(API_ENTRY_POINT_URL + 'customers/' + customerData.id +'/bookings/', {
      headers: new Headers({'Authorization': this.authService.token})
    })
      .map(
        (response: Response) => response.json()
      )
      .subscribe(
        (data: BookingData[]) => {
            console.log(data);
            this.dataLoaded.next(data);
        },
        (error) => {
          this.dataLoadFailed.next(true);
          this.dataLoaded.next(null);
        }
      );
  }

}
