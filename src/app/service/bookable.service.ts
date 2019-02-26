import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { BookableData } from '../model/bookable-data.model';
import { RequestQueryBuilder } from '../other/search-query-builder';
import { IQueryParams } from '../other/query-params.interface';

// const SESSION_JWT_TOKEN:string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaWtvIiwiZXhwIjoxNTUxODc1NzAzfQ.mc-L9KoLhB84hyvTu4bsMmFlHXDN6ftaJ91G4v2qLvsgv54xSEHUSsof9WDK4FqoNbn2Z3nKja40p8qV2o-MuQ';
const API_ENTRY_POINT_URL:string = 'http://localhost:8080/api/v1/'

@Injectable()
export class BookableService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<BookableData[]>();
  dataLoadFailed = new Subject<boolean>();
  bookableDataList:BookableData[];

  constructor(private http: Http) {
  }

  onRetrieveData(queryParams:IQueryParams) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);

    let rqb:RequestQueryBuilder= new RequestQueryBuilder(queryParams);
    let requestParams: string = rqb.toRequestParameter();
    console.log('call onRetrieveData...' + requestParams);

    this.http.get(API_ENTRY_POINT_URL + 'bookables/?' + requestParams,  {
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
        },
        (error) => {
          this.dataLoadFailed.next(true);
          this.dataLoaded.next(null);
        }
      );
  }

}
