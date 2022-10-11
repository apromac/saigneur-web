import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'piece'
})
export class PiecePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
