import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Utility} from '../constants/utility';

const baseUrl = environment.apiUrl + 'zone/'

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http: HttpClient) { }

  getAllZone(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllZone`)
  }
  getAllZoneByDistrict(idDistrict?): Observable<Response> {
    if(!idDistrict)
    {
      idDistrict = Utility.loggedUser.district;
    }
    return this.http.get<Response>(`${baseUrl}district/${idDistrict}`)
  }

  getAllZoneById(idZone): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findZoneByID/${idZone}`);
  }
}
