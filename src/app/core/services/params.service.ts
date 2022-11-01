import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, pipe} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TYPEPARAMS} from '../../data/enums/type-params';
import {Params} from '../../data/schemas/params';
import {Utility} from '../constants/utility';

const baseUrl = environment.apiUrl + ''
const motivation = 'motivation/'
@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  constructor(private http: HttpClient) { }

  getAllMotivation(): Observable<Params[]> {
    return this.http.get<Params[]>(`${baseUrl}${motivation}findAllMotivation`)
      .pipe(map((m)=> {
        console.log(m);
        return m.map((mt)=> {
          let mot = mt as any;
          let motiv = {
            nom : mot.descriptionMotivation,
            valeur : ''+mot.motivationID,
            abbr: 'MOTIV'+mot.motivationID,
            type: TYPEPARAMS.MOTIVATION,
            description : mot.descriptionMotivation
          };
          // Utility.LOCALPARAMS.push(motiv);
          return motiv;
        });
      } ));
  }

  getParams(type: TYPEPARAMS): Observable<Params[]> {
    return this.http.get<Params[]>(`assets/data/${type}.json`);
      // .pipe(map((m)=> {
      //   console.log(m);
      //   if(type === '')
      //   return m.map((mt)=> {
      //     let mot = mt as any;
      //     return {
      //       nom : 'NE'+mot.nveauEtudeID,
      //       valeur : ''+mot.libelleNiveauEtude,
      //       abbr: '',
      //       description : mot.libelleNiveauEtude,
      //     }
      //   });
      // } ));
  }

  // addParams(data: any, type:TYPEPARAMS): Observable<Response> {
  //   return this.http.put<Response>(`${baseUrl}${type.MOTIVATION.labelle}/create`, data);
  // }
 }
