import {Campagne} from '../../data/schemas/campagne';
import {Params} from '../../data/schemas/params';
import {UsersModel} from '../../data/schemas/users.model';

export class Utility {
  static loggedUser: UsersModel = JSON.parse(sessionStorage.getItem('userlogged'));
  static CURRENTCAMPAGNE: Campagne;
  static LOCALPARAMS: Params[] = [];
}
