import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookableService } from '../service/bookable.service';
import { BookingService } from '../service/booking.service';
import { BookableData } from '../model/bookable-data.model';
import { BookingData } from '../model/booking-data.model';
import { CustomerData } from '../model/customer-data.model';
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
  bookableDataList: BookableData[] = [];

  constructor(private router: Router
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
      id : 301,
      name: 'niko'
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
    this.bookingService.onStoreData(booking);

    let bsAlertParams = {
      isMessageShow: true,
      isSuccess: true,
      status: 'OK!',
      message: 'Booking is completed.'
    }
    this.router.navigate(['/confirmation'], { queryParams: bsAlertParams });
  }

}
