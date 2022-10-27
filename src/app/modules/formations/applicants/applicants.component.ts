import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {Utility} from '../../../core/constants/utility';
import {GenderPipe} from '../../../core/pipes/gender.pipe';
import {CampagneService} from '../../../core/services/campagne.service';
import {CandidatService} from '../../../core/services/candidat.service';
import {ParamsService} from '../../../core/services/params.service';
import {PROFIL} from '../../../data/enums/profil';
import {STATUS_CANDIDAT} from '../../../data/enums/status';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';
import {InscriptionModel} from '../../../data/schemas/inscription.model';
import {InfoApplicantComponent} from '../info-applicant/info-applicant.component';
import {NewApplicantComponent} from '../new-applicant/new-applicant.component';

// import DismissReason = module;

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {
  title = 'Inscription des candidats';
  @ViewChild('contentInfo') contentInfo: TemplateRef<any>;
  isAdmin = Utility.loggedUser.profilActuel === PROFIL.ADMIN;
  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouveau candidat',
    },
    btnClick: () => {
      this.startInscription();
    },
    title: this.title
  };

  allCampagnes: Campagne[] = [];
  allApplicants: Candidat[] = [];
  campagneSelected: Campagne;
  currentApplicant: Candidat;
  inscription: InscriptionModel;
  currentCampagne = Utility.CURRENTCAMPAGNE;

  isLoading = false;

  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas,
              private candidatService: CandidatService,
              private toast: ToastrService,
              private paramsService: ParamsService,
              private campagneService: CampagneService) {
  }

  ngOnInit(): void {
    // this.comboCampagneChange(this.currentCampagne.campagneID);
    if(!this.isAdmin) {
    this.getListApplicant();
    }
    this.fetchCombosData();
  }

  fetchCombosData(): void {
    // console.log(Utility.LOCALPARAMS);
    // this.paramsService.getParams('niveau-etude').subscribe((
    //   {
    //     next: value => {
    //       console.log(value);
    //     },
    //     error: (err: HttpErrorResponse) => {
    //       console.error(err);
    //     }
    //   }
    // ));
    this.campagneService.getAllCampagne().subscribe({
      next: (resp) => {
        this.allCampagnes = (resp as any as Campagne[]);
        this.currentCampagne = this.allCampagnes.find((c)=> c.activeCampagne);
        this.comboCampagneChange(this.currentCampagne.campagneID);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error('Une erreur s\'est produite', 'STATUS ' + err.status);
      },
      complete: () => {

      }
    });
  }

  comboCampagneChange(val: number): void {
    this.campagneSelected = this.allCampagnes.find((c) => c.campagneID == val);
    console.log(val, this.campagneSelected);
    // this.campagneSelected = val
    // this.title = this.campagneSelected.libelleCampagne;
    // this.tableHeader.title = this.title;
    this.getListApplicant();

  }

  getListApplicant() {
    // if (!this.campagneSelected) {
    //   return;
    // }
    this.isLoading = true;
    this.allApplicants = [];
    let obs: Observable<any>;
    if(this.isAdmin && this.campagneSelected) {
      obs =  this.candidatService.getCdtByCampagneID(this.campagneSelected.campagneID, STATUS_CANDIDAT.NEW_CANDIDAT)
    } else {
      obs = this.candidatService.getAllCurrentCandidatByStatus(STATUS_CANDIDAT.NEW_CANDIDAT);
    }
    // this.candidatService.getCdtByCampagneID(this.campagneSelected.campagneID).subscribe({
    obs.subscribe({
      next: (resp) => {
        this.allApplicants = (resp as any as Candidat[])?.map((c) => {
          let cdt = c;
          cdt.libelleGenre =  new GenderPipe().transform(c.genreCandidat);
          return cdt;
        });
        console.log(resp);
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  startInscription(): void {
    if (!this.campagneSelected) {
      this.campagneSelected = this.allCampagnes[0];
    }
    const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.campagne = this.campagneSelected;
    modalRef.componentInstance.allCandidat = this.allApplicants;
    modalRef.componentInstance.inscriptionEnd.subscribe((hasSaved) => {
      if (hasSaved) {
        this.getListApplicant();
      }
    });

    // Swal.fire({
    //   title: 'INSCRIPTION D\'UN CANDIDAT',
    //   text: '',
    //   icon: 'question',
    //   showCloseButton : true,
    //   showCancelButton: true,
    //   confirmButtonColor: '#34c38f',
    //   cancelButtonColor: '#f46a6a',
    //   confirmButtonText: 'Nouveau candidat',
    //   cancelButtonText: 'Ancien Candidat!'
    // }).then(result => {
    //   console.log(result);
    //   if (result.value) {
    //     const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop : 'static'});
    //     modalRef.componentInstance.name = 'World';
    //   } else if (result.dismiss === Swal.DismissReason.cancel)  {
    //     document.getElementById('btnmodal').click();
    //     // DismissReason.getCloseButton().addEventListener( 'click', (r, )=> {
    //     //
    //     // })
    //   }
    // });
  }

  oldCandidat(cont): void {
    const modalRef = this.modalService.open(cont, {centered: true, size: 'xl', scrollable: true, backdrop: 'static'});
  }

  openEnd(content: TemplateRef<any>) {
    let cn = this.offcanvasService.open(content, {position: 'end'});
    cn.componentInstance.candidatInfo = this.currentApplicant;
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Détails',
        isMatDesign: true,
        icon: 'info',
        click: (item) => {
          console.log(item);
          this.currentApplicant = item;
          let cn = this.offcanvasService.open(InfoApplicantComponent, {position: 'end'});
          cn.componentInstance.candidatInfo = this.currentApplicant;
        }
      },
      {
        title: 'Modifier',
        isMatDesign: true,
        color: 'green',
        icon: 'edit',
        click: (item) => {
          this.currentApplicant = item;
          const modalRef = this.modalService.open(NewApplicantComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
          });
          modalRef.componentInstance.campagne = this.campagneSelected;
          modalRef.componentInstance.inscription = this.currentApplicant;
          console.log(this.allApplicants);
          modalRef.componentInstance.allCandidat = this.allApplicants;
        }
      },
      {
        title: 'Supprimer',
        isMatDesign: true,
        color: 'red',
        icon: 'delete',
        click: (item) => {
          console.log(item);
          this.candidatService.removeCandidat(item).subscribe({
            next: value => {
              this.toast.success('Candidat supprimé avec succès');
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
              this.toast.error(err.error.message, 'STATUS ' + err.status);
            }
          });
        }
      }
    ];
  }
}
