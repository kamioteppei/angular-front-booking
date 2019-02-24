import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BsAlertParams } from '../other/bs.alert.param';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  bsAlertParams: BsAlertParams

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    let params  = this.route.snapshot.queryParamMap
    console.log(params)

    this.bsAlertParams = {
      isMessageShow: params.get('isMessageShow') == 'true',
      isSuccess: params.get('isSuccess') == 'true',
      status: params.get('status'),
      message: params.get('message')
    }
  }

}
