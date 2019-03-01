import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { BookableData } from '../model/bookable-data.model';
import { BookingData } from '../model/booking-data.model';
import { AuthService } from '../user/auth.service';
import { CustomerData } from '../model/customer-data.model';

const API_ENTRY_POINT_URL:string = 'http://localhost:8080/api/v1/'

@Injectable()
export class BookingService {

  dataIsLoading = new Subject<boolean>();
  dataLoadFailed = new Subject<boolean>();
  dataLoaded = new BehaviorSubject<BookingData[]>([]);

  dataEdited = new Subject<boolean>();
  bookableData: BookableData;

  constructor(private http: Http,
              private authService: AuthService) {
  }

  onStoreData(bookingData: BookingData) {

    if (!this.authService.isAuthenticated) {
      return;
    }

    let customerId: number = bookingData.customer.id;
    this.http.post(API_ENTRY_POINT_URL + 'customers/' + customerId + '/bookings/', bookingData, {
      headers: new Headers({'Authorization': this.authService.token })
    })
      .subscribe(
        (result) => {
          this.dataEdited.next(true);
        },
        (error) => {
          this.dataEdited.next(false);
        }
      );
  }

  onRetrieveData(customerData:CustomerData) {

    if (!this.authService.isAuthenticated) {
      return;
    }

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
          this.dataLoadFailed.next(false);
        },
        (error) => {
          this.dataLoadFailed.next(true);
        }
      );
  }

}
