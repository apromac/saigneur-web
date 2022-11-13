import {STATUS_CANDIDAT} from '../enums/status';
import {Campagne} from './campagne';
import {Candidat} from './candidat';

export class InscriptionModel {
  campagneEntity: Campagne;
  candidatEntity: Candidat;
  inscriptionDTO: InscriptionDTO;
}

export class InscriptionDTO {
  abreviationDistrictInscription: string;
  anneeFormation: string;
  statut: STATUS_CANDIDAT = STATUS_CANDIDAT.NEW_CANDIDAT;
  anneePlanteurActivite: string;
  anneePlanteurEmploi: string;
  anneePlanteurFormation: string;
  contactPlanteurActivite: number;
  contactPlanteurEmploi: number;
  contactPlanteurFormation: number;
  dateInscription: string;
  districtInscription: string;
  inscriptionID: number;
  isActivite: boolean;
  isAppliquer: boolean;
  isFormer: boolean;
  isSelectionner: boolean = false;
  isInterview :	boolean = false
  isRetenu : boolean =false;
  lieuFormation: string;
  lieuPlanteurActivite: string;
  lieuPlanteurFormation: string;
  lieuPlanteurEmploi: string;
  matriculePlanteurActivite: string;
  matriculePlanteurEmploi: string;
  matriculePlanteurFormation: string;
  motivation: string;
  nomPlanteurActivite: string;
  nomPlanteurEmploi: string;
  nomPlanteurFormation: string;
  propositionEmploi: boolean;
  structureFormation: string;
  typeFormation: string;
  typeSaigneFormation: string;
  zoneInscription: string;

  noteCouche: number;
  noteLongueDistance: number;
  noteObscurite: number;
  noteOccupation: number;
  notePresencePlantation: number;
  noteReveil: number;
  noteSprotif: number;
  noteVelo: number;

  peurObscurite : boolean;
  sportif: boolean;
  monteVelo: boolean;
  presencePlantation: boolean;

  motifPresencePlantation: string;
  descriptionSportif: string;
  descriptionReveil: string;
  descriptionOccupation: string;
  descriptionLongueDistance: string;
  descriptionCouche: string;

  isInterviewer: boolean;

  campagne: Campagne;
  candidat: Candidat;
  statusVal: string;
  distanceInscription = 0;
}

