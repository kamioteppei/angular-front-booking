import { Component, OnInit } from '@angular/core';
import { BookableService } from '../service/bookable.service';
import { BookableData } from '../model/bookable-data.model';

@Component({
  selector: 'app-bookable',
  templateUrl: './bookable.component.html',
  styleUrls: ['./bookable.component.css']
})
export class BookableComponent implements OnInit {
  didFail = false;
  bookableDataList: BookableData[] = [];

  constructor(private bookableService: BookableService) {}

  ngOnInit() {

    this.bookableService.dataLoaded.subscribe(
      (list: BookableData[]) => {
        this.bookableDataList = list;
      }
    );
    this.bookableService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );
  }
}
