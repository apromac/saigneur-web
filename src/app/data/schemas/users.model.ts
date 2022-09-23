import {PosteModel} from './poste.model';

export class UsersModel {
  nomUtilisateur?: string;
  password?: string;
  photoUtilisateur?: string;
  prenomsUtilisateur?;
  poste?: PosteModel;
  posteActuel?: string;
  username?: string;
  utilisateurID?: number;
}
