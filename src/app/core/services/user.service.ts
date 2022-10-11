import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {OccuperModel} from '../../data/schemas/occuper.model';
import {UsersModel} from '../../data/schemas/users.model';

const baseUrl = environment.apiUserUrl + 'utilisateur/';
const baseOccuperUrl = environment.apiUserUrl + 'occuper/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  auth(credential: { password, username }): Observable<Response> {
    return this.http.post<Response>(`${baseUrl}auth`, credential);
  }

  getAllUser(): Observable<Response> {
    // return this.http.get<Response>(`${baseUrl}findAllUtilisateur`)
    return this.http.get<Response>(`${baseUrl}findUtilisateurDetails`);
  }

  findUserById(idUser: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByUtilisateurID/${idUser}`);
  }

  createUser(user: UsersModel): Observable<Response> {
    return this.http.post<Response>(`${baseUrl}saveUtilisateur`, user);
  }

  editUser(user: UsersModel): Observable<Response> {
    return this.http.put<Response>(`${baseUrl}${user.utilisateurID}`, user);
  }

  addPoste(occuper: OccuperModel): Observable<Response> {

    // console.log(obj);
    occuper.isOccuper = true;
    return this.http.post<Response>(`${baseOccuperUrl}saveOccuper`, occuper);
    // return this.http.post<Response>(`${baseOccuperUrl}saveOccuper/utilisateur/${occuper.utilisateur.utilisateurID}/poste/${occuper.poste.posteID}`, occuper);
  }
}
