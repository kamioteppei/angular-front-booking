import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { SigninComponent } from './user/signin/signin.component';
// import { SignupComponent } from './user/signup/signup.component';
import { BookingComponent } from './booking/booking.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
// import { AuthGuard } from './user/auth-guard.service';

const routes: Routes = [
  // { path: '', component: SigninComponent },
  // { path: 'signup', component: SignupComponent },
  // { path: 'booking', canActivate: [AuthGuard], component: BookingComponent },
  { path: '', component: BookingComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'confirmation', component: ConfirmationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [AuthGuard]
  providers: []
})
export class AppRoutingModule {}
