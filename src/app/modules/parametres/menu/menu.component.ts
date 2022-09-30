import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ProfilService} from '../../../core/services/profil.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {ProfilModel} from '../../../data/schemas/profil.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  allProfil: ProfilModel[] = [];
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
  constructor(private profilService: ProfilService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getAllProfil();
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
