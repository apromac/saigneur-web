import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const basrUrl = environment.apiUrl + 'campagne/';

@Injectable({
  providedIn: 'root'
})
export class CampagneService {

  constructor(private http: HttpClient) { }

  public getAllCampagne(): Observable<Response> {
    return this.http.get<Response>(`${basrUrl}/findAllCampagne`)
  }

  public getCampagneByid(idCampagne: any): Observable<Response> {
    return this.http.get<Response>(`${basrUrl}findByCampagneID/${idCampagne}`)
  }
}
