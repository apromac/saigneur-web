import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'job'
})
export class JobPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
