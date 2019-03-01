import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BsAlertParams } from '../other/bs.alert.param';
import { BookingService } from '../service/booking.service';
import { BookingData } from '../model/booking-data.model';
import { CustomerData } from '../model/customer-data.model';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  bsAlertParams: BsAlertParams
  didFail = false;
  bookingDataList: BookingData[] = [];

  constructor(private authService: AuthService
            , private route: ActivatedRoute
            , private bookingService: BookingService) { }

  ngOnInit() {

    if (!this.authService.isAuthenticated) {
      return;
    }

    this.bookingService.dataLoaded.subscribe(
      (list: BookingData[]) => {
        console.log('ConfirmationComponent.ngOnInit' +  list);
        this.bookingDataList = list;
      }
    );
    this.bookingService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

    let params  = this.route.snapshot.queryParamMap
    console.log(params)

    this.bsAlertParams = {
      isMessageShow: params.get('isMessageShow') == 'true',
      isSuccess: params.get('isSuccess') == 'true',
      status: params.get('status'),
      message: params.get('message')
    }

    let customer: CustomerData = {
      id : this.user.id,
      name: this.user.username
    }
    this.bookingService.onRetrieveData(customer);
  }

  get user(): User {
    return this.authService.getAuthenticatedUser();
  }

}
