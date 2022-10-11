import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'params'
})
export class ParamsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
