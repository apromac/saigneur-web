import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  baseUrl_Access = environment.apiUserUrl + 'acceder/';
  baseUrl_Menu = environment.apiUserUrl + 'menu/';

  constructor(private http: HttpClient) {
  }

  getAllMenu(): Observable<Response> {
    return this.http.get<Response>(`${this.baseUrl_Menu}findAllMenu`);
  }

  getProfilAcces(pID: number): Observable<Response>{
    return  this.http.get<Response>(`${this.baseUrl_Access}profil/findByProfilID/${pID}`);
  }

  saveAccess(access:any): Observable<Response>{
    return  this.http.post<Response>(`${this.baseUrl_Access}saveMenuByProfil`, access);
  }
}
