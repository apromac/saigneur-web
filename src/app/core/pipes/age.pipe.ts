import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value:any): unknown {
    let year = new Date().getFullYear();
    let dN = new Date(value).getFullYear();
    console.log(year, dN);
    return year - dN;
    // return moment().diff(moment(value));
  }

}
