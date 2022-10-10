import {Injectable} from '@angular/core';
import {TYPEPARAMS} from '../../data/enums/type-params';
import {Utility} from '../constants/utility';
import {ParamsService} from './params.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private paramsService: ParamsService) {
  }

  initApp(): void {
    Utility.LOCALPARAMS = [];
    this.getCurrentJob();
    this.getNiveauEtude();
    this.getPiece();
    this.getStructure();
    this.getTypeFormation();
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
