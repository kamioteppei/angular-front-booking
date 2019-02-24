import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4AlertModule } from 'ng4-alert';

import { AppComponent } from './app.component';
import { BookableService } from './service/bookable.service';
import { BookingService } from './service/booking.service';
import { SearchComponent } from './search/search.component';
import { BookableComponent } from './bookable/bookable.component';
import { BookingComponent } from './booking/booking.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BookableComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng4AlertModule.forRoot() // For bootstrap-aleart.
  ],
  providers: [BookableService,BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
