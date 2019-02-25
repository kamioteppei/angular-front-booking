import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BsAlertParams } from '../other/bs.alert.param';
import { BookingService } from '../service/booking.service';
import { BookableData } from '../model/bookable-data.model';
import { BookingData } from '../model/booking-data.model';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  bsAlertParams: BsAlertParams
  didFail = false;
  bookingDataList: BookingData[] = [];

  constructor(private route: ActivatedRoute
    , private bookingService: BookingService) { }

  ngOnInit() {

    let params  = this.route.snapshot.queryParamMap
    console.log(params)

    this.bsAlertParams = {
      isMessageShow: params.get('isMessageShow') == 'true',
      isSuccess: params.get('isSuccess') == 'true',
      status: params.get('status'),
      message: params.get('message')
    }

    this.bookingService.onRetrieveData();

    this.bookingService.dataLoaded.subscribe(
      (list: BookingData[]) => {
        this.bookingDataList = list;
      }
    );
    this.bookingService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

  }

}
