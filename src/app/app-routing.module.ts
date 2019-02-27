import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { BookingComponent } from './booking/booking.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthGuard } from './guard/auth-guard';
import { ImmutableAuthGuard } from './guard/immutable-auth-guard';

const routes: Routes = [
  { path: '', component: BookingComponent },
  { path: 'booking', component: BookingComponent },
  // { path: 'confirmation', canActivate: [AuthGuard], component: ConfirmationComponent },
  { path: 'confirmation',  component: ConfirmationComponent },
  { path: 'signin', canActivate: [ImmutableAuthGuard], component: SigninComponent },
  { path: 'signup', canActivate: [ImmutableAuthGuard], component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, ImmutableAuthGuard]
})
export class AppRoutingModule {}
