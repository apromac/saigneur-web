import {Campagne} from './campagne';
import {Candidat} from './candidat';

export class InscriptionModel {
  campagneEntity: Campagne;
  candidatEntity: Candidat;
  inscriptionDTO: InscriptionDTO;
}


class InscriptionDTO {
  abreviationDistrictInscription: string;
  anneeFormation: string;
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
  isSelectionner: boolean;
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
}
