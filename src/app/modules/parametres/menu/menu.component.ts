import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MenuService} from '../../../core/services/menu.service';
import {ProfilService} from '../../../core/services/profil.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {MenuModel} from '../../../data/schemas/menu.model';
import {ProfilModel} from '../../../data/schemas/profil.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  allProfil: ProfilModel[] = [];
  allMenu : MenuModel[] = [];
  allMenuForW : MenuModel[] = [];
  profilSelected: ProfilModel;
  header: CustomTableHeaderInfo = {
    title: 'Gestion des profils',
    withBtn : true,
    btn : {
      libelle : 'Mettre à jour les modifications',
      bg: 'btn-primary',
    },
    btnClick :()=>{

    }
  };
  constructor(private profilService: ProfilService,
              private menuService : MenuService,
              private toast: ToastrService) { }

  ngOnInit(): void {
    this.getAllProfil();
    this.getAllMenu();
  }

  getAllMenu(): void {
    this.menuService.getAllMenu().subscribe({
      next : value => {
        console.log(value);
        this.allMenuForW = value as any as MenuModel[];
        this.allMenuForW.forEach((m, i)=>{
          // this.allMenu.push(m);
          this.orderMenu(m);
        })
      }
    })
  }
  orderMenu(menu : MenuModel): void {
    this.allMenu.push(menu);
    // let ind =this.allMenuForW.findIndex((m)=> m.menuID === menu.menuID);
    if(menu.hasSousMenu) {
      menu.children = this.allMenuForW.filter((m)=> m.parentIdMenu === menu.menuID);
      menu.children.forEach((m)=> {
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

  getAllProfil():void {
    this.profilService.getAllProfil().subscribe({
      next : value => {
        console.log(value);
        this.allProfil = value as any as ProfilModel[];
      }, error: err => {
        this.toast.error(err.err.message, 'STATUS ' + err.status);
      }
    });
  }

  getNombreUser() {
   const min = Math.ceil(10);
    const max = Math.floor(100);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getNombre() {
    return Array.from(Array(50).keys())
  }
}
