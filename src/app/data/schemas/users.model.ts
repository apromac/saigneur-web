import {PosteModel} from './poste.model';

export class UsersModel {
  nomUtilisateur?: string;
  password?: string;
  photoUtilisateur?: string;
  prenomsUtilisateur?;
  poste?: PosteModel;
  postLabel?: string;
  username?: string;
  utilisateurID?: number;
}