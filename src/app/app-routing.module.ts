import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { BookingComponent } from './booking/booking.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './guard/auth-guard';
import { ImmutableAuthGuard } from './guard/immutable-auth-guard';

const routes: Routes = [
  { path: '', component: BookingComponent },
  { path: 'booking', redirectTo: '', component: BookingComponent , pathMatch: 'full'},
  // { path: 'confirmation',  component: ConfirmationComponent , pathMatch: 'full'},
  { path: 'confirmation', canActivate: [AuthGuard], component: ConfirmationComponent , pathMatch: 'full' },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent , pathMatch: 'full' },
  { path: 'signin', canActivate: [ImmutableAuthGuard], component: SigninComponent , pathMatch: 'full'},
  { path: 'signup', canActivate: [ImmutableAuthGuard], component: SignupComponent , pathMatch: 'full'},
  { path: '**', redirectTo: '', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, ImmutableAuthGuard]
})
export class AppRoutingModule {}
