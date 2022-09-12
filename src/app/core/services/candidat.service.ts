import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Candidat} from '../../data/schemas/candidat';

const baseUrl  = `${environment.apiUrl}candidat/`
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});


@Injectable({
  providedIn: 'root'
})
export class CandidatService {

  constructor(private http: HttpClient) { }

  getCandidatById(idCdt: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}/findByCandidatID/${idCdt}`);
  }

  getAllCandidats(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}/findAllCandidat`);
  }


  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<[Candidat, string[]]>(baseUrl, {params: PARAMS.set('search', term)}).pipe(
        map(response => response[1])
      );
  }
}
