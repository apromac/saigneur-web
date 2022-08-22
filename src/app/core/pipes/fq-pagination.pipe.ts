import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fqPagination'
})
export class FqPaginationPipe implements PipeTransform {

  transform(value: any[], config: { itemsPerPage?: number, currentPage?: number }): unknown {
    // @ts-ignore
    if (!value || value && value.length <= config.itemsPerPage) {
      return value;
    }

    if (!config) {
      config = {
        currentPage: 1,
        itemsPerPage: 10
      };
    } else {
      if (!config.itemsPerPage) {
        config.itemsPerPage = 10;
      }
      if (!config.currentPage) {
        config.currentPage = 1;
      }
    }
    console.log(value, config);
    // @ts-ignore
    const currentLotStart = (config.currentPage * config.itemsPerPage) - config.itemsPerPage;
    // @ts-ignore
    const v = value.slice(currentLotStart, config.currentPage * config.itemsPerPage);
    this.valueChangeLister(config);
    console.log(v, value);
    return v;
  }


  valueChangeLister(config :{ itemsPerPage?: number, currentPage?: number }): void {
    new Proxy(config, {
      set(target: { itemsPerPage?: number; currentPage?: number }, p: PropertyKey, value: any, receiver: any): boolean {
        return true;
      }
    })
  }
}
