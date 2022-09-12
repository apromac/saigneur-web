import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const baseUrl = environment.apiUrl+'auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  connect(data : {username, password}): Observable<any> {
    return this.http.get<any>(baseUrl);
  }
}
