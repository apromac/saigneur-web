import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolVal'
})
export class BoolValPipe implements PipeTransform {

  transform(value: any): unknown {
    return value ? 'OUI' : 'NON';
  }

}
