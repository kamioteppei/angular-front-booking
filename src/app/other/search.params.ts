import { IQueryParams } from '../other/query-params.interface';

// export class SearchParams extends RequestQueryBuilder{
export class SearchParams implements IQueryParams{
  dtFrom: Date;
  dtTo: Date;
  hotelId: Number;
  roomId: Number;
  charge: Number;
  option1: string;
  option2: string;
  option3: string;
  offset: Number;
  limit: Number;
}
