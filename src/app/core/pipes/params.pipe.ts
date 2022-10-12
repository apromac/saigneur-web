import { Pipe, PipeTransform } from '@angular/core';
import {TYPEPARAMS} from '../../data/enums/type-params';
import {Utility} from '../constants/utility';

@Pipe({
  name: 'params'
})
export class ParamsPipe implements PipeTransform {

  transform(value: any, typeParams: TYPEPARAMS): unknown {
    let v = value == '0'? '1': value;
    let params = Utility.LOCALPARAMS.find((p)=> p.valeur == v && p.type == typeParams);
    console.log(Utility.LOCALPARAMS, params)
    if(params) {
      return params.description
    }
    return '';
  }

}
