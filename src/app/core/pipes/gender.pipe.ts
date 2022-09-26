import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any): string {
    return value == '0'? 'Masculin' : 'Féminin';
  }

}
