import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Response} from '../../data/schemas/response';

const baseUrl = environment.apiCandidatUrl +'candidat/'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }

  getAllCandidat(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllCandidat`);
  }

  getAllCandidatByID(idCdt): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByCandidatID/${idCdt}`);
  }

  getCdtByCampagneID(idCampagne): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByCampagneID/${idCampagne}`);
  }
}
