import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { BookableData } from '../model/bookable-data.model';
import { RequestQueryBuilder } from '../other/search-query-builder';
import { IQueryParams } from '../other/query-params.interface';
import * as constant from '../app-constant';

@Injectable()
export class BookableService {
  dataIsLoading = new Subject<boolean>();
  dataLoaded = new Subject<BookableData[]>();
  dataLoadFailed = new Subject<boolean>();
  bookableDataList:BookableData[];

  constructor(private http: Http) {
  }

  onRetrieveData(queryParams:IQueryParams) {
    this.dataLoaded.next([]);
    this.dataLoadFailed.next(false);

    let rqb:RequestQueryBuilder= new RequestQueryBuilder(queryParams);
    let requestParams: string = rqb.toRequestParameter();
    console.log('call onRetrieveData...' + requestParams);

    this.http.get(constant.API_DOMAIN_ENTRY_POINT_URL + 'bookables/?' + requestParams,  {
      headers: new Headers({'Content-Type': 'application/json'})
     })
      .map(
        (response: Response) => response.json()
      )
      .subscribe(
        (data) => {
            console.log(data);
            this.bookableDataList = data;
            this.dataLoaded.next(data);
            this.dataLoadFailed.next(false);
          },
        (error) => {
          this.bookableDataList = [];
          this.dataLoaded.next([]);
          this.dataLoadFailed.next(true);
        }
      );
  }

}
