import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MenuService} from '../../../core/services/menu.service';
import {ProfilService} from '../../../core/services/profil.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {AccederModel} from '../../../data/schemas/acceder.model';
import {MenuModel} from '../../../data/schemas/menu.model';
import {ProfilModel} from '../../../data/schemas/profil.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  allProfil: ProfilModel[] = [];
  currentAcceder: { profilID: number, menuIDs?: number[] };
  accessLoading = true;
  isSaving = false;
  // currentMenuId = 0;

  allMenu: MenuModel[] = [];
  allMenuForW: MenuModel[] = [];
  profilSelected: ProfilModel;
  header: CustomTableHeaderInfo = {
    title: 'Gestion des profils',
    withBtn: false,
    btn: {
      libelle: 'Enregistrer les modifications',
      bg: 'btn-primary',
    },
  };
  extraParameter = '4';

  constructor(private profilService: ProfilService,
              private menuService: MenuService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllProfil();
    this.getAllMenu();
  }

  getAllMenu(): void {
    this.menuService.getAllMenu().subscribe({
      next: value => {
        console.log(value);
        this.allMenu = value as any as MenuModel[];
        this.constructMenu();
      }
    });
  }

  constructMenu(): void {
    this.allMenuForW = [];
    const niveau0 = this.allMenu.filter((m) => m.parentIdMenu === 0);
    niveau0.sort((m1, m2) => parseInt(m1.numeroOrdreMenu, 10) - parseInt(m2.numeroOrdreMenu, 10));
    niveau0.forEach((m) => {
      m.children = this.getSubMenu(m);
      this.allMenuForW.push(m);
    });

    console.error(this.allMenuForW);
  }

  getSubMenu(m: MenuModel): MenuModel[] {
    if (m.hasSousMenu) {
      let sm = this.allMenu.filter((mn) => mn.parentIdMenu === m.menuID);
      sm.sort((m1, m2) => parseInt(m1.numeroOrdreMenu, 10) - parseInt(m2.numeroOrdreMenu, 10));
      return sm.map((m) => {
        if (m.hasSousMenu) {
          m.children = this.getSubMenu(m);
        }
        return m;
      });
    } else {
      return [];
    }
  }


  getAllProfil(): void {
    this.profilService.getAllProfil().subscribe({
      next: value => {
        console.log(value);
        this.allProfil = value as any as ProfilModel[];
        this.profilSelected = this.allProfil[0];
        this.getAcces();
        // this.currentAcceder = {}
      }, error: err => {
        this.toast.error(err.err.message, 'STATUS ' + err.status);
      }
    });
  }

  getAcces(): void {
    this.accessLoading = true;
    this.currentAcceder = {
      menuIDs: [],
      profilID: this.profilSelected.profilID
    };
    this.menuService.getProfilAcces(this.profilSelected.profilID).subscribe({
      next: value => {
        if (value) {
          console.error(value);
          (value as any as AccederModel[]).map((a) => this.currentAcceder.menuIDs.push(a.menu.menuID));
          console.log(this.currentAcceder);
        }
        this.accessLoading = false;
      }, error: (err: HttpErrorResponse) => {
        console.log(err);
        this.accessLoading = false;
        this.toast.error('Une erreur s\'est produite', 'STATUS ' + err.status);
      }
    });
  }

  saveAccess(): void {
    console.log(this.currentAcceder);
    // return;
    this.isSaving = true;
    this.currentAcceder.menuIDs = [...new Set(this.currentAcceder.menuIDs)];
    this.menuService.saveAccess(this.currentAcceder).subscribe({
      next: value => {
        this.toast.success('Menus enregistrés avec succès');
        console.log(value);
        this.isSaving = false;
        this.getAcces();
      },
      error: err => {
        console.error(err);
        this.isSaving = false;
        // this.accessLoading = false;
      }
    });
  }

  getNombreUser() {
    const min = Math.ceil(10);
    const max = Math.floor(100);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getNombre() {
    return Array.from(Array(50).keys());
  }


  giveAccess(menu: MenuModel, mID: number, profil: ProfilModel, pID: number): void {
    console.log(menu, mID, profil, pID);
  }

  menuClicked(m: MenuModel) {
    this.addOrRemoveChild(m);

      let isPresent = this.hasMenu(m) >= 0;
    if (m.hasSousMenu) {
      this.isPresent(m, isPresent);
      // m.ch
    }
    this.addOrRemoveParent(m);

    console.log(this.currentAcceder);
  }
  addOrRemoveParent(m: MenuModel){
    if(m.parentIdMenu!==0) {
      let parent = this.allMenu.find((men)=> men.menuID === m.parentIdMenu);
      let isSelected = this.hasMenu(parent)>= 0;
      // if(isPresent) {
        if(!isSelected) {
          this.currentAcceder.menuIDs.push(m.parentIdMenu);

        } else {
          let allChildren = this.allMenu.filter((m)=> m.parentIdMenu == parent.menuID);
          if(allChildren && allChildren.length>0) {
            let hasChildChecked = allChildren.findIndex((m)=> this.hasMenu(m)>=0);
            console.log(hasChildChecked);
            if(hasChildChecked<0) {
              let hasMenu = this.hasMenu(parent);
              if(hasMenu>=0) {
                this.currentAcceder.menuIDs.splice(hasMenu, 1);
                // this.currentAcceder.menuIDs.push(hasMenu);
              }
              // this.currentAcceder.menuIDs.splice(parent.menuID, 1);
            }
          }
        }
        this.addOrRemoveParent(parent);
      // }
      /**
       * UNSELECTED PARENT
       */
      // else {
      //     if(isSelected) {
      //       this.currentAcceder.menuIDs.push(m.parentIdMenu)
      //     }
      //     this.addOrRemoveParent(parent, isPresent);
      // }
    }

  }

  isPresent(m: MenuModel, isPresent: boolean) {
    if (isPresent) {
      m.children.forEach((c) => {
        let hasMenu = this.hasMenu(c);
        if(hasMenu<0) {
          // this.currentAcceder.menuIDs.splice(hasMenu, 1);
          this.currentAcceder.menuIDs.push(c.menuID);
        } /*else {
        }*/
        if(c.hasSousMenu) {
          this.isPresent(c, true);
        }
      });
    } else {
      m.children.forEach((c) => {
        let hasMenu = this.hasMenu(c);
        if(hasMenu>=0) {
          this.currentAcceder.menuIDs.splice(hasMenu, 1);
          // this.currentAcceder.menuIDs.push(hasMenu);
        } /*else
        {
        }*/
        if(c.hasSousMenu) {
          this.isPresent(c, false);
        }
      });
    }
  }

  addOrRemoveChild(m: MenuModel): void {
    let hasMenu = this.hasMenu(m);
    if (hasMenu >= 0) {
      this.currentAcceder.menuIDs.splice(hasMenu, 1);
    } else {
      this.currentAcceder.menuIDs.push(m.menuID);
    }
  }

  profilClicked(p: ProfilModel): void {
    this.profilSelected = p;
    this.getAcces();
  }

  hasMenu(m: MenuModel): number {
    return this.currentAcceder?.menuIDs?.findIndex((ac) => ac == m.menuID);
  }
}
