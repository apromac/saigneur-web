import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  baseUrl = environment.apiUserUrl + 'menu/';

  constructor(private http: HttpClient) {
  }

  getAllMenu(): Observable<Response> {
    return this.http.get<Response>(`${this.baseUrl}findAllMenu`);
  }
}
