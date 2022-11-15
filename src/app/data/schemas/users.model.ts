import {MenuModel} from './menu.model';
import {PosteModel} from './poste.model';

export class UsersModel {
  nomUtilisateur?: string;
  password?: string;
  photoUtilisateur?: string;
  prenomsUtilisateur? : string;
  poste?: PosteModel;
  posteActuel?: string;
  telephoneUtilisateur?: string;
  username?: string;
  utilisateurID?: number;
  menus?:MenuModel[]
  profilActuel?: string;
  district?: any;
  zone?: any;
}
