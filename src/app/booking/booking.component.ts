import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../user/auth.service';
import { BookableService } from '../service/bookable.service';
import { BookingService } from '../service/booking.service';
import { BookableData } from '../model/bookable-data.model';
import { BookingData } from '../model/booking-data.model';
import { CustomerData } from '../model/customer-data.model';
import { User } from '../user/user.model';
import { RoomData } from '../model/room-data.model';
import { SearchParams } from '../other/search.params';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @ViewChild('searchForm') form: NgForm;

  didFail = false;
  dataEdited = new BehaviorSubject<boolean>(false);
  bookableDataList: BookableData[] = [];

  constructor(private authService: AuthService
            , private router: Router
            , private bookableService: BookableService
            , private bookingService: BookingService)  {
  }

  ngOnInit() {
    this.bookableService.dataLoaded.subscribe(
      (list: BookableData[]) => {
        this.bookableDataList = list;
      }
    );
    this.bookableService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );
  }

  onSubmit() {
    console.log(this.form.value.dtFrom)
    console.log(this.form.value.dtTo)

    let searchParams: SearchParams = {
      dtFrom: this.form.value.dtFrom as Date,
      dtTo: this.form.value.dtTo as Date,
      hotelId: null,
      roomId: null,
      charge: null,
      option1: null,
      option2: null,
      option3: null,
      offset: null,
      limit: null
    };
    this.bookableService.onRetrieveData(searchParams);
  }

  onPostBookingData(bookableData: BookableData) {

    console.log(bookableData)

    let dummyId = 0;

    let customer: CustomerData = {
      id : this.user.id,
      name: this.user.username
    }

    let dummyRoom: RoomData = {
      id: 0,
      name: 'dummy'
    }

    let booking: BookingData = {
      id: dummyId,
      customer: customer,
      hotel: bookableData.hotel,
      room: dummyRoom,
      inDate: bookableData.dtFrom,
      outDate: bookableData.dtTo,
      canceled: false,
    }

    this.bookingService.dataEdited.subscribe(
      (result) => {
        let bsAlertParams = {
          isMessageShow: true,
          isSuccess: true,
          status: 'OK!',
          message: 'Booking is completed.'
        }
        this.router.navigate(['/confirmation'], { queryParams: bsAlertParams });
      },
      (error) => {
        let bsAlertParams = {
          isMessageShow: true,
          isSuccess: false,
          status: 'ERROR!',
          message: 'Booking is not completed.'
        }
        this.router.navigate(['/confirmation'], { queryParams: bsAlertParams });
      }
    );
    this.bookingService.onStoreData(booking);

  }

  get user(): User {
    return this.authService.getAuthenticatedUser();
  }

}
