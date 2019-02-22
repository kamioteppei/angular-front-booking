import { IQueryParams } from '../other/query-params.interface';

export class RequestQueryBuilder{

  constructor(private params: IQueryParams) {}

  dateFormat(dt:Date): string {
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();
    let w = dt.getDay();
    let yyyyMinusMMMinusdd = String(y) + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
    return yyyyMinusMMMinusdd;
  }

  toRequestParameter(): string {
    let paramList:string[] = new Array();
    for (let key in this.params){
      let value = this.params[key];
      if (value == null){
        continue;
      }
      let param:string[] = new Array(key, value);
      paramList.push(param.join('='));
    }
    return paramList.join('&');
  }

}
