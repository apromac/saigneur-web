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


  candidatID: number;
  dateNaisCandidat: string;
  age: string;
  genreCandidat: string;
  libelleGenre: string;
  lieuNaisCandidat: string;

  lieuResidCandidat: string;
  lieuResidLibelle: string;
  metierActuelCandidat: string;

  niveauEtudeCandidat: string;
  niveauEtudeLibelle: string;

  nomCandidat: string;
  numeroPieceCandidat: string;
  premierContactCandidat: number;
  prenomsCandidat: string;
  secondContactCandidat: number;
  typePieceCandidat: string;


  campagne: Campagne;
  candidat: Candidat;
}
