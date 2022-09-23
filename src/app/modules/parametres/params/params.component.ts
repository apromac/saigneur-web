import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {CampagneService} from '../../../core/services/campagne.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Campagne} from '../../../data/schemas/campagne';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss']
})
export class ParamsComponent implements OnInit {
  allParams: any[] = [];
  allCampagne: Campagne[] = [];

  fGrpCampagne : FormGroup;

  constructor(private modalService: NgbModal,
              private toast: ToastrService,
              private fb: FormBuilder,
              private campagneService: CampagneService) {
  }

  ngOnInit(): void {
    this.fGrpCampagne = this.fb.group({
      libelleCampagne: ['', Validators.required],
      activeCampagne: [1]
    });
    this.getAllCampagne();
  }

  public tableHeaderCampagne: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Ajouter',
    },
    btnClick: () => {
      document.getElementById('btnmodalcampagne').click();
    },
    title: 'Campagnes',
  };
  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouveau paramètre',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Paramètres',
  };

  openModal(modal): void{
    const modalRef = this.modalService.open(modal, {centered: true, backdrop: 'static'});
    // modalRef.componentInstance.name = 'World';
  }

  getAllCampagne(): void {
    this.campagneService.getAllCampagne().subscribe({
      next : value => {
        this.allCampagne = (value as any as Campagne[]).map((c)=> {
          let cp = c;
          cp.statusVal = c.activeCampagne ? 'check-circle text-success' : 'close text-danger';
          return cp;
        });
      },
      error : (err: HttpErrorResponse)=> {
        console.log(err);
        this.toast.error(err.message, 'STATUS ' + err.status);
      }
    })
  }
  saveCampagne(): void {
    console.log(this.fGrpCampagne.value);
    this.campagneService.addCampagne(this.fGrpCampagne.value).subscribe({
      next : value => {
        this.toast.success('Campagne ajoutée avec succès');
        this.modalService.dismissAll();
        this.getAllCampagne();
      },
      error : (err: HttpErrorResponse)=> {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      }
    })
  }

  close(): void{
    this.modalService.dismissAll();
  }
  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Modifier',
        isMatDesign: true,
        icon: 'edit',
        color: 'green',
        click: (item) => {
          console.log(item);
        }
      },
      {
        title: 'Supprimer',
        isMatDesign: true,
        icon: 'delete',
        color: 'red',
        click: (item) => {
          console.log(item);
        }
      }
    ];
  }

}
