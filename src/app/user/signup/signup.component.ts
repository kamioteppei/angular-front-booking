import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BsAlertParams } from '../../other/bs.alert.param';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  bsAlertParams:BsAlertParams = new BsAlertParams;
  didFail = false;
  isLoading = false;

  constructor(private authService: AuthService
            , private router: Router) {
  }

  ngOnInit() {
    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => {
        this.didFail = didFail
        if(didFail){
          console.log('signup didFail -> ' + didFail);
          let bsAlertParams:BsAlertParams = {
            isMessageShow: true,
            isSuccess: false,
            status: 'Error',
            message: 'ご入力したユーザー情報ではアカウントを作成できません。'
          }
          this.bsAlertParams = bsAlertParams;
        } else {
          console.log('signin navigate to booking')
          this.router.navigate(['/booking']);
        }
    });
  }

  onSubmit() {
    const usrName = this.form.value.username;
    const password = this.form.value.password;
    this.authService.signUp(usrName, password);
  }

}
