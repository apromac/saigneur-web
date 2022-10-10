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
  // currentMenuId = 0;

  allMenu: MenuModel[] = [];
  allMenuForW: MenuModel[] = [];
  profilSelected: ProfilModel;
  header: CustomTableHeaderInfo = {
    title: 'Gestion des profils',
    withBtn: true,
    btn: {
      libelle: 'Enregistrer les modifications',
      bg: 'btn-primary',
    },
    btnClick: () => {
      console.log(this.currentAcceder);
      this.saveAccess();
    }
  };

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
        this.allMenuForW = value as any as MenuModel[];
        this.allMenuForW.forEach((m, i) => {
          // this.allMenu.push(m);
          this.orderMenu(m);
        });
      }
    });
  }

  orderMenu(menu: MenuModel): void {
    this.allMenu.push(menu);
    // let ind =this.allMenuForW.findIndex((m)=> m.menuID === menu.menuID);
    if (menu.hasSousMenu) {
      menu.children = this.allMenuForW.filter((m) => m.parentIdMenu === menu.menuID);
      menu.children.forEach((m) => {
        this.orderMenu(m);
      });
    }
  }

  getChildren(menu: MenuModel[], parent) {
    const out = [];
    for (const i in menu) {
      if (menu[i].parentIdMenu === parent) {
        const children = this.getChildren(menu, menu[i].menuID);

        if (children.length) {
          menu[i].children = children;
        }
        out.push(menu[i]);
      }
    }
    return out;
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

          (value as any as AccederModel[]).map((a) => this.currentAcceder.menuIDs.push(a.menu.menuID));
          console.log(this.currentAcceder);
          this.accessLoading = false;
        }
      }, error: (err: HttpErrorResponse) => {
        console.log(err);
        this.accessLoading = false;
        this.toast.error('Une erreur s\'est produite', 'STATUS ' + err.status);
      }
    });
  }
  saveAccess(): void {
    this.menuService.saveAccess(this.currentAcceder).subscribe({
      next : value => {
        this.toast.success('Menus enregistrés avec succès');
        console.log(value);
      },
      error: err => {
        console.error(err);
      }
    })
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
    let hasMenu = this.hasMenu(m);
    if (hasMenu >= 0) {
      this.currentAcceder.menuIDs.splice(hasMenu, 1);
    } else {
      this.currentAcceder.menuIDs.push(m.menuID);
    }
    console.log(this.currentAcceder);
  }

  profilClicked(p: ProfilModel): void {
    this.profilSelected = p;
    this.getAcces();
  }

  hasMenu(m: MenuModel): number {
    return this.currentAcceder.menuIDs.findIndex((ac) => ac == m.menuID);
  }
}
