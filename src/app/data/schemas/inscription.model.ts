import {Campagne} from './campagne';
import {Candidat} from './candidat';

export class InscriptionModel {
  campagne: Campagne;
  candidat: Candidat;
  inscriptionDTO: InscriptionDTO;
  // dateInscription: string;
  // abreviationDistrictInscription: string;
  // districtInscription: string;
  // inscriptionID: number;
  // zoneInscription: string;
}


class InscriptionDTO {
  abreviationDistrictInscription: string;
  dateInscription	: string;
  districtInscription	: string
  inscriptionID: number;
  zoneInscription: string;
}
