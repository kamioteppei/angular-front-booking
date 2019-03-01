import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BsAlertParams } from '../../other/bs.alert.param';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  bsAlertParams:BsAlertParams = new BsAlertParams;
  // didFail = false;
  isLoading = false;

  constructor(private authService: AuthService
            , private router: Router) {
  }

  ngOnInit() {

    if (this.authService.isAuthenticated) {
      return;
    }

    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => {
        // this.didFail = didFail
        if(didFail){
          console.log('signin didFail -> ' + didFail);
          let bsAlertParams:BsAlertParams = {
            isMessageShow: true,
            isSuccess: false,
            status: 'Error',
            message: 'ログイン情報が正しくありません。'
          }
          this.bsAlertParams = bsAlertParams;
        } else {
          console.log('signin navigate to booking:pathTo -> ' + this.authService.pathTo)
          if(this.authService.pathTo){
            this.router.navigate([this.authService.pathTo]);
          } else {
            this.router.navigate(['/booking']);
          }
        }
    });
  }

  onSubmit() {
    const usrName = this.form.value.username;
    const password = this.form.value.password;
    this.authService.signIn(usrName, password);
  }
}
