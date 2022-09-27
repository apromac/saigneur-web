import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any): string {
    if(value == '0')
      return 'Masculin';
    else if(value == '1')
      return 'Féminin';
    else
      return value;
    // return value == ('0' || 'Masculin') ? 'Masculin' : 'Féminin';
  }

}
