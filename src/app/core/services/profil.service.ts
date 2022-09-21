import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const baseUrl = environment.apiUserUrl + 'profil/';


@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http: HttpClient) {
  }

  getAllProfil(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllProfil`);
  }


}
