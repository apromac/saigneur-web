import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PROFIL} from '../../data/enums/profil';
import {TYPEPARAMS} from '../../data/enums/type-params';
import {ZoneApromac} from '../../data/schemas/zone-apromac';
import {Utility} from '../constants/utility';
import {ParamsService} from './params.service';
import {ZoneService} from './zone.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private paramsService: ParamsService, private zonService: ZoneService) {
  }

  initApp(): void {
    Utility.LOCALPARAMS = [];
    this.getCurrentJob();
    this.getNiveauEtude();
    this.getPiece();
    this.getStructure();
    this.getTypeFormation();
    this.paramsService.getAllMotivation().subscribe((v)=> {
      // let motiv = {
      //   nom : mot.descriptionMotivation,
      //   valeur : ''+mot.motivationID,
      //   abbr: 'MOTIV'+mot.motivationID,
      //   type: TYPEPARAMS.MOTIVATION,
      //   description : mot.descriptionMotivation
      // };
      Utility.LOCALPARAMS.push(...v);
    });
    this.getAllZone();
  }

  getAllZone(): void {
    if(!Utility.loggedUser) {
      return;
    }
    let obs: Observable<any>;
    if(Utility.loggedUser.profilActuel === PROFIL.ADMIN){
      obs =  this.zonService.getAllZone();
    } else {
      obs =  this.zonService.getAllZoneByDistrict();
    }
   obs.subscribe({
      next : value => {
        if(value) {
          (value as any as ZoneApromac[]).forEach((r)=>{
            Utility.LOCALPARAMS.push({
              nom: r.libelleZone,
              valeur : r.zoneID.toString(),
              type: TYPEPARAMS.ZONE,
              description: r.libelleZone,
              abbr:'',
            });
          });

        }
      },
      error: err => {

      }
    })
  }
  getNiveauEtude(): void {
    this.paramsService.getParams(TYPEPARAMS.NIVEAUETUDE).subscribe({
      next: value => {
        console.log(value);
        (value as any[]).forEach((v)=> {
          Utility.LOCALPARAMS.push({
            nom : v.libelleNiveauEtude,
            abbr : 'NE' +v.niveauEtudeID,
            valeur : v.niveauEtudeID,
            type : TYPEPARAMS.NIVEAUETUDE,
            description : v.libelleNiveauEtude
          });
        });

      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getCurrentJob(): void {
    this.paramsService.getParams(TYPEPARAMS.JOB).subscribe({
      next: value => {
        console.log(value);
        (value as any[]).forEach((v)=> {
          Utility.LOCALPARAMS.push({
            nom : v.metierLibelle,
            abbr : 'JB' +v.metierID,
            valeur : v.metierID,
            type : TYPEPARAMS.JOB,
            description : v.metierLibelle
          });
        });
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getPiece(): void {
    this.paramsService.getParams(TYPEPARAMS.PIECE).subscribe({
      next: value => {
        console.log(value);
        (value as any[]).forEach((v)=> {
          Utility.LOCALPARAMS.push({
            nom : v.libelleTypePiece,
            abbr : 'PC' +v.typePieceID,
            valeur : v.typePieceID,
            type : TYPEPARAMS.PIECE,
            description : v.libelleTypePiece
          });
        });
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getStructure(): void {
    this.paramsService.getParams(TYPEPARAMS.STRUCTURE).subscribe({
      next: value => {
        console.log(value);
        (value as any[]).forEach((v)=> {
          Utility.LOCALPARAMS.push({
            nom : v.libelleStructure,
            abbr : 'ST' +v.structureID,
            valeur : v.structureID,
            type : TYPEPARAMS.STRUCTURE,
            description : v.libelleStructure
          });
        });
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getTypeFormation(): void {
    this.paramsService.getParams(TYPEPARAMS.TYPEFORMATION).subscribe({
      next: value => {
        console.log(value);
        (value as any[]).forEach((v)=> {
          Utility.LOCALPARAMS.push({
            nom : v.libelleTypeFormation,
            abbr : 'TF' +v.typeFormationID,
            valeur : v.typeFormationID,
            type : TYPEPARAMS.TYPEFORMATION,
            description : v.libelleTypeFormation
          });
        });
      }, error: (err) => {
        console.error(err);
      }
    });
  }
}
