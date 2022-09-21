import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UsersModel} from '../../data/schemas/users.model';

const baseUrl = environment.apiUserUrl + 'utilisateur/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUser(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllUtilisateur`)
  }

  findUserById(idUser: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByUtilisateurID/${idUser}`);
  }

  createUser(user: UsersModel): Observable<Response> {
    return this.http.post<Response>(`${baseUrl}saveUtilisateur`, user);
  }
}
