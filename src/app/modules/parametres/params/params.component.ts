import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CampagneService} from '../../../core/services/campagne.service';
import {DistrictService} from '../../../core/services/district.service';
import {PosteService} from '../../../core/services/poste.service';
import {ProfilService} from '../../../core/services/profil.service';
import {ZoneService} from '../../../core/services/zone.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Campagne} from '../../../data/schemas/campagne';
import {District} from '../../../data/schemas/district';
import {PosteModel} from '../../../data/schemas/poste.model';
import {ProfilModel} from '../../../data/schemas/profil.model';
import {ZoneApromac} from '../../../data/schemas/zone-apromac';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss']
})
export class ParamsComponent implements OnInit {
  @ViewChild('nwposte') nwposte: TemplateRef<any>;
  @ViewChild('nwcp') nwcp: TemplateRef<any>;
  @ViewChild('nwprofil') nwprofil: TemplateRef<any>;

  allParams: any[] = [];
  allCampagne: Campagne[] = [];
  allProfils: ProfilModel[] = [];
  allPoste: PosteModel[] = [];

  poste: PosteModel;
  profil: ProfilModel;
  campagne: Campagne;

  fGrpCampagne: FormGroup;
  fGrpProfil: FormGroup;
  fGrpPoste: FormGroup;
  config= {
    itemsPerPage: 5,
    currentPage: 1
  };

  allDistrict : District[] = [];
  allZone : ZoneApromac[] = [];

  PANEL: 'CAMPAGNE' | 'POSTE' | 'PROFIL';

  constructor(private modalService: NgbModal,
              private toast: ToastrService,
              private fb: FormBuilder,
              private campagneService: CampagneService,
              private posteService: PosteService,
              private districtService : DistrictService,
              private zoneService : ZoneService,
              private profilService: ProfilService
  ) {
  }

  ngOnInit(): void {
    this.fGrpCampagne = this.fb.group({
      libelleCampagne: ['', Validators.required],
      activeCampagne: [1]
    });

    this.fGrpPoste = this.fb.group({
      libellePoste: ['', Validators.required],
      profil: [1, Validators.required],
    });

    this.fGrpProfil = this.fb.group({
      libelleProfil: ['', Validators.required],
    });
    this.getAllList();
  }

  setFormProfil(): void {
    this.fGrpProfil.reset();
    this.fGrpProfil = this.fb.group({
      profilID: [this.profil.profilID],
      libelleProfil: [this.profil.libelleProfil, Validators.required],
    });
  }

  setFormPoste(): void {
    console.log(this.poste);
    this.fGrpPoste.reset();
    this.fGrpPoste = this.fb.group({
      posteID: [this.poste.posteID],
      profil: [this.poste.profil.profilID],
      libellePoste: [this.poste.libellePoste, Validators.required],
    });
  }

  setFormCampagane(): void {
    this.fGrpCampagne.reset();
    this.fGrpCampagne = this.fb.group({
      campagneID: [this.campagne.campagneID],
      activeCampagne: [this.campagne.activeCampagne],
      libelleCampagne: [this.campagne.libelleCampagne, Validators.required],
    });
  }

  initFormProfil(): void {
    this.fGrpProfil = this.fb.group({
      libelleProfil: ['', Validators.required],
    });
  }

  initFormPoste(): void {
    this.fGrpPoste = this.fb.group({
      profil: ['', Validators.required],
      districtBean: [''],
      zoneBean: [''],
      libellePoste: ['', Validators.required],
    });
    this.fGrpPoste.reset();
    // this.profil = new ProfilModel();

  }

  initFormCampagane(): void {
    this.fGrpCampagne = this.fb.group({
      libelleCampagne: ['', Validators.required],
      activeCampagne: [1],
    });
  }

  getAllList(): void {
    this.getAllProfil();
    this.getAllPoste();
    this.getAllCampagne();
  }

  getAllDisctrict() {
    this.districtService.getAll().subscribe({
      next : value => {
        this.allDistrict = value as unknown as District[];
        this.fGrpPoste.controls['districtBean'].setValue(this.allDistrict[0].libelleDistrict);
        this.getZoneByDistrict(this.allDistrict[0].districtID);
      },
      error: err => {
        this.toast.error('Une erreur s\'est produite', 'STATUS ' + err.status);
      }
    })
  }
  getZoneByDistrict(val): void {
    var dist = this.allDistrict.find((d)=> d.districtID == val);
    this.fGrpPoste.controls['districtBean'].setValue(dist.libelleDistrict);
    this.zoneService.getAllZoneByDistrict(dist.libelleDistrict).subscribe({
      next : value =>  {
        this.allZone = value as unknown as ZoneApromac[];
        this.fGrpPoste.controls['zoneBean'].setValue(this.allZone[0].libelleZone);
      }, error : err => {
        this.toast.error('Une erreur s\'est produite', 'STATUS '+ err.status);
      }
    })
  }
  zoneChange(val) : void{
    var z = this.allZone.find((z)=> z.zoneID == val);
    this.fGrpPoste.controls['zoneBean'].setValue(z.libelleZone);
  }

  public tableHeaderCampagne: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Ajouter',
    },
    btnClick: () => {
      this.initFormCampagane();
      this.openModal(this.nwcp);
      // document.getElementById('btnmodalcampagne').click();
    },
    title: 'Campagnes',
  };

  public tableHeaderProfil: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Ajouter',
    },
    btnClick: () => {
      this.initFormProfil();
      this.openModal(this.nwprofil);
      // document.getElementById('btnmodalcampagne').click();
    },
    title: 'Profils',
  };

  public tableHeaderPoste: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Ajouter',
    },
    btnClick: () => {
      this.initFormPoste();
      this.getAllDisctrict();
      this.openModal(this.nwposte);
      // document.getElementById('btnmodalcampagne').click();
    },
    title: 'Postes',
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

  openModal(modal): void {
    const modalRef = this.modalService.open(modal, {centered: true, backdrop: 'static'});
    // modalRef.componentInstance.name = 'World';
  }

  getAllCampagne(): void {
    this.campagneService.getAllCampagne().subscribe({
      next: value => {
        this.allCampagne = (value as any as Campagne[]).map((c) => {
          let cp = c;
          cp.statusVal = c.activeCampagne ? 'check-circle text-success' : 'close text-danger';
          return cp;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.message, 'STATUS ' + err.status);
      }
    });
  }

  getAllProfil(): void {
    this.profilService.getAllProfil().subscribe({
      next: value => {
        this.allProfils = (value as any as ProfilModel[]).map((c) => {
          let cp = c;
          // cp.statusVal = c.activeCampagne ? 'check-circle text-success' : 'close text-danger';
          return cp;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    });
  }

  getAllPoste(): void {
    this.allPoste = [];
    this.posteService.getAllPoste().subscribe({
      next: value => {
        this.allPoste = (value as any as PosteModel[]).map((c) => {
          let cp = c;
          cp.libelleProfil = c.profil.libelleProfil;
          return cp;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    });
  }

  saveCampagne(): void {
    console.log(this.fGrpCampagne.value);
    let obs: Observable<any>;
    let isModif = this.fGrpCampagne.value['campagneID'];
    if (isModif) {
      obs = this.campagneService.updateCampagne(this.fGrpCampagne.value);
    } else {
     obs = this.campagneService.addCampagne(this.fGrpCampagne.value);
    }
    obs.subscribe({
      next: value => {
        this.toast.success('Campagne ' + (isModif ? 'modifiée' : 'ajoutée') + ' avec succès');
        this.modalService.dismissAll();
        this.getAllCampagne();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      }
    });
  }

  profilChange($e): void {
    console.log($e);

    this.profil = this.allProfils.find((p)=> p.profilID == $e);
    // this.fGrpPoste.reset();
    this.fGrpPoste.controls['libellePoste'].setValue(null);
  }
  savePoste(): void {
    console.log(this.fGrpPoste.controls['profil'], this.fGrpPoste.value['profil'])
    // let profil = this.allProfils.find((p)=> p.profilID == this.fGrpPoste.controls['profil'].value )
    let isModif = this.fGrpPoste.value['posteID'];
    let obs: Observable<any>;
    let obj = this.fGrpPoste.value;
    obj.profil = this.profil;
    console.log(this.fGrpPoste.value, obj);
    if (isModif) {
      obs = this.posteService.updatePoste(obj);
    } else {
      obs = this.posteService.addPoste(obj);
    }
    obs.subscribe({
      next: value => {
        this.toast.success('Poste ' + (isModif? 'modifié' : 'ajouté') +' avec succès');
        this.modalService.dismissAll();
        this.getAllPoste();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      }
    });
  }

  saveProfil(): void {
    console.log(this.fGrpPoste.value);
    let obs: Observable<any>;
    let isModif = this.fGrpPoste.value['profilID'];
    if (isModif) {
      obs = this.profilService.updateProfil(this.fGrpProfil.value);
    } else {
      obs = this.profilService.addProfil(this.fGrpProfil.value);
    }
    obs.subscribe({
      next: value => {
        this.toast.success('Profil ' + (isModif ? 'modifié' : 'ajouté') + ' avec succès');
        this.modalService.dismissAll();
        this.getAllProfil();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      }
    });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  getMenus(s: 'CAMPAGNE' | 'POSTE' | 'PROFIL'): DropdownMenuInfo[] {
    return [
      {
        title: 'Modifier',
        isMatDesign: true,
        icon: 'edit',
        color: 'green',
        click: (item) => {
          let tplRef: TemplateRef<any>;
          switch (s) {
            case 'CAMPAGNE':
              tplRef = this.nwcp;
              this.campagne = item;
              this.setFormCampagane();
              break;
            case 'POSTE':
              tplRef = this.nwposte;
              this.poste = item;
              this.getAllDisctrict();
              this.setFormPoste();
              break;
            case 'PROFIL':
              tplRef = this.nwprofil;
              this.profil = item;
              this.setFormProfil();
              break;
          }
          this.openModal(tplRef);
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
