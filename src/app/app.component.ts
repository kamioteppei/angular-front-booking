import { Component, OnInit } from '@angular/core';
import { BookableService } from './service/bookable.service';
import { BookableData } from './model/bookable-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  didFail = false;
  bookableDataList: BookableData[] = [];
  bookableData: BookableData;

  constructor(private bookableService: BookableService) {}

  ngOnInit() {

    this.bookableService.onRetrieveData(true);

    this.bookableData = this.bookableService.bookableData;
    console.log('first set bookableData' + this.bookableData)

    this.bookableService.dataEdited.subscribe(
      () => this.bookableData = this.bookableService.bookableData
    );
    this.bookableService.dataLoaded.subscribe(
      (list: BookableData[]) => {
        this.bookableDataList = list;
      }
    );
    this.bookableService.dataLoadFailed.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

    console.log('last set bookableData' + this.bookableData)

  }

}
