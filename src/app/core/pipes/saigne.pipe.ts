import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'saigne'
})
export class SaignePipe implements PipeTransform {

  transform(value: any): string {
    switch (value) {
      case '0':
      case '1':
        return 'Inversé';
      case '2':
        return 'Descendant';
      default:
        return value;

    }
  }

}
