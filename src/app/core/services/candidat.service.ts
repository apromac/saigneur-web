import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {STATUS_CANDIDAT} from '../../data/enums/status';
import {Candidat} from '../../data/schemas/candidat';
import {InscriptionModel} from '../../data/schemas/inscription.model';

const baseUrl  = `${environment.apiCandidatUrl}candidat/`
const baseUrlInscription  = `${environment.apiCandidatUrl}inscription/`
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
    return this.http.get<Response>(`${baseUrl}findByCandidatID/${idCdt}`);
  }
  getAllCandidats(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllCandidat`);
  }

  getAllCurrentCandidatByStatus(status : STATUS_CANDIDAT): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}campagne/findByCurrentCampagne/statut/${status}`);
  }

  getAllCurrentCandidat(selected): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}campagne/findByCurrentCampagne`);
  }
  validateInterview(idCdt: number, isSelected: boolean): Observable<Response> {
    return this.http.get<Response>(`${baseUrlInscription}candidat/${idCdt}/interview/${isSelected}`);
  }
  getCandidatInterview(): Observable<Response> {
    return this.http.get<Response>(`${baseUrlInscription}interview`);
  }
  getCandidatRetenu(): Observable<Response> {
    return this.http.get<Response>(`${baseUrlInscription}retenu`);
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

  addCandidat(cdt: InscriptionModel): Observable<Response> {
    return this.http.post<Response>(`${baseUrlInscription}saveInscription`, cdt);
  }
  validateCandidat(selectionDTO : {inscriptionID: number,  status: boolean}): Observable<Response> {
    return this.http.get<Response>(`${baseUrlInscription}${selectionDTO.inscriptionID}/selection/${selectionDTO.status}`);
  }

  removeCandidat(idCandidat): Observable<Response> {
    return this.http.get<Response>(`${baseUrlInscription}deleteCandidat/${idCandidat}`);
  }
}
