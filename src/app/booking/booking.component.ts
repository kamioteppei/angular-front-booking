import { Component, OnInit } from '@angular/core';
import { Ng4AlertService } from 'ng4-alert';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  alertError = false;
  alertSuccess = true;
  message = 'success!!'

  title = 'MyApp';
  options = {
      text:"Success !",
      type:"fail",
      autoDismis:false,
      timeout:2000
  }
  constructor(private ng4AlertService:Ng4AlertService) { }

  ngOnInit() {
  }

  activate(){
    this.ng4AlertService.ng4Activate(this.options);
}

}
