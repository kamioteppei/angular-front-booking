import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4AlertModule } from 'ng4-alert';

import { AppComponent } from './app.component';
// import { SignupComponent } from './user/signup/signup.component';
// import { SigninComponent } from './user/signin/signin.component';
import { BookingComponent } from './booking/booking.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AppRoutingModule } from './app-routing.module';
// import { AuthService } from './user/auth.service';
import { BookableService } from './service/bookable.service';
import { BookingService } from './service/booking.service';

@NgModule({
  declarations: [
    AppComponent,
    // SignupComponent,
    // SigninComponent,
    BookingComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  // providers: [AuthService,BookableService,BookingService],
  providers: [BookableService,BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
