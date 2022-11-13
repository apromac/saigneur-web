import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PosteModel} from '../../data/schemas/poste.model';
import {ProfilModel} from '../../data/schemas/profil.model';

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

  updateProfil(profil: ProfilModel): Observable<Response>{
    return   this.http.put<Response>(`${baseUrl}${profil.profilID}`, profil);
  }
  delete(profil: ProfilModel): Observable<Response>{
    return   this.http.delete<Response>(`${baseUrl}${profil.profilID}`);
  }
  addProfil(profil: ProfilModel): Observable<Response>{
    return   this.http.post<Response>(`${baseUrl}saveProfil`, profil);
  }
}
