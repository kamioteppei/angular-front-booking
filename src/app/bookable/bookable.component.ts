import { Component, OnInit } from '@angular/core';
import { BookableService } from '../service/bookable.service';
import { BookingService } from '../service/booking.service';
import { BookableData } from '../model/bookable-data.model';
import { BookingData } from 'app/model/booking-data.model';
import { CustomerData } from 'app/model/customer-data.model';
import { RoomData } from 'app/model/room-data.model';

@Component({
  selector: 'app-bookable',
  templateUrl: './bookable.component.html',
  styleUrls: ['./bookable.component.css']
})
export class BookableComponent implements OnInit {
  didFail = false;
  bookableDataList: BookableData[] = [];

  constructor(private bookableService: BookableService
            , private bookingService: BookingService) {}

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

  onPostBookingData(bookableData: BookableData) {

    console.log(bookableData)

    let dummyId = 0;

    let customer: CustomerData = {
      id : 301,
      name: 'niko'
    }

    let dummyRoom: RoomData = {
      id: 201,
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
  }

}
