import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const baseUrl = environment.apiUrl + 'district/'


@Injectable({
  providedIn: 'root'
})
export class DistrictService {


  constructor(private http: HttpClient) { }

  getAll(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllDistrict`)
  }
  getByID(idDistrict): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}${idDistrict}`)
  }
}
