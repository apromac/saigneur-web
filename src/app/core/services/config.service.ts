import { Injectable } from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private paramsService : ParamsService) { }

  initApp(): void{
  this.getCurrentJob();
  this.getNiveauEtude();
  this.getPiece();
  this.getStructure();
  this.getTypeFormation();
  }

  getNiveauEtude(): void {
    this.paramsService.getParams('niveau-etude').subscribe({
      next: value => {
        console.log(value);
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getCurrentJob(): void {
    this.paramsService.getParams('current-job').subscribe({
      next: value => {
        console.log(value);
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getPiece(): void {
    this.paramsService.getParams('piece').subscribe({
      next: value => {
        console.log(value);
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getStructure(): void {
    this.paramsService.getParams('structure').subscribe({
      next: value => {
        console.log(value);
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  getTypeFormation(): void {
    this.paramsService.getParams('type-formation').subscribe({
      next: value => {
        console.log(value);
      }, error: (err) => {
        console.error(err);
      }
    });
  }
}
