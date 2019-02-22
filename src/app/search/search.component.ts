import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BookableService } from '../service/bookable.service';
import { SearchParams } from '../other/search.params';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('searchForm') form: NgForm;

  didFail = false;

  constructor(private bookableService: BookableService) {}

  ngOnInit() {
    // this.form.dtFrom.setValue(new Date());
    // this.form.value.dtTo = new Date();
  }

  onSubmit() {

    console.log(this.form.value.dtFrom)
    console.log(this.form.value.dtTo)

    let searchParams: SearchParams = {
      dtFrom: this.form.value.dtFrom as Date,
      dtTo: this.form.value.dtTo as Date,
      hotelId: null,
      roomId: null,
      charge: null,
      option1: null,
      option2: null,
      option3: null,
      offset: null,
      limit: null
    };
    this.bookableService.onRetrieveData(searchParams);
  }
}
