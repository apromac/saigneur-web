import {PosteModel} from './poste.model';
import {UsersModel} from './users.model';

export class OccuperModel {
  dateOccuper?: string;
  districtOccuper?: string;
  isOccuper? = true;
  libelleOccuper?: string;
  motifOccuper?: string;
  occuperID?: number;
  poste?: PosteModel;
  utilisateur?: UsersModel;
  zoneOccuper?: string;
}
