import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PosteModel} from '../../data/schemas/poste.model';

const baseUrl = environment.apiUserUrl + 'poste/';
const baseUrlLocalite = environment.apiCandidatUrl + 'localite/';
// localite/findByPosteTDH
@Injectable({
  providedIn: 'root'
})
export class PosteService {

  constructor(private http: HttpClient) {
  }

  getAllPoste(): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findAllPoste`);
  }

  getPosteByProfil(idProfil: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByProfil/${idProfil}`);
  }
  getDTOById(idPoste: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}findByPosteDTO/${idPoste}`);
  }

  getLocaliteByTDH(idPoste: number): Observable<Response> {
    return this.http.get<Response>(`${baseUrlLocalite}findByPosteTDH/${idPoste}`);
  }

  updatePoste(poste: PosteModel): Observable<Response>{
  return   this.http.put<Response>(`${baseUrl}${poste.posteID}`, poste);
  }

  addPoste(poste: PosteModel): Observable<Response>{
  return   this.http.post<Response>(`${baseUrl}savePoste`, poste);
  }
}
