import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {ApplicationService} from '../../../core/services/application.service';
import {CampagneService} from '../../../core/services/campagne.service';
import {CandidatService} from '../../../core/services/candidat.service';
import {ParamsService} from '../../../core/services/params.service';
import {TYPEPARAMS} from '../../../data/enums/type-params';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';
import {InscriptionModel} from '../../../data/schemas/inscription.model';
import {NewApplicantComponent} from '../new-applicant/new-applicant.component';
import DismissReason from 'sweetalert2';

// import DismissReason = module;

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {
  title = 'Liste des candidats';
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

  isLoading = false;
  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas,
              private candidatService: CandidatService,
              private toast: ToastrService,
              private paramsService : ParamsService,
              private campagneService: CampagneService) {
  }

  ngOnInit(): void {
    this.getListApplicant();
    this.fetchCombosData();
  }

  fetchCombosData(): void {
    this.paramsService.getParams('niveau-etude').subscribe((
      {
        next : value => {
          console.log(value);
        },
        error : (err : HttpErrorResponse)=> {
          console.error(err);
    }
      }
    ))
    this.campagneService.getAllCampagne().subscribe({
      next: (resp) => {
        this.allCampagnes = (resp as any as Campagne[]);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error('Une erreur s\'est produite', 'STATUS ' +err.status);
      },
      complete: () => {

      }
    });
  }

  comboCampagneChange(val: number): void {
    this.campagneSelected = this.allCampagnes.find((c) => c.campagneID == val);
    console.log(val, this.campagneSelected);
    // this.campagneSelected = val
    this.title = this.campagneSelected.libelleCampagne;
    this.tableHeader.title = this.title;
    this.getListApplicant();

  }

  getListApplicant() {
    // if (!this.campagneSelected) {
    //   return;
    // }
    this.isLoading = true;
    // this.candidatService.getCdtByCampagneID(this.campagneSelected.campagneID).subscribe({
    this.candidatService.getAllCandidats().subscribe({
      next: (resp) => {
        this.allApplicants = resp as any as Candidat[];
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
    if(!this.campagneSelected) {
      this.campagneSelected = this.allCampagnes[0];
    }
    const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.campagne = this.campagneSelected;
    modalRef.componentInstance.inscriptionEnd.subscribe((hasSaved)=>{
      if(hasSaved) {
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
    this.offcanvasService.open(content, {position: 'end'});
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Détails',
        isMatDesign: true,
        icon: 'info',
        click: (item) => {
          console.log(item);
        }
      },
      {
        title: 'Modifier',
        isMatDesign: true,
        color: 'green',
        icon: 'edit',
        click: (item) => {
          this.currentApplicant = item;
          const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop: 'static'});
          modalRef.componentInstance.campagne = this.campagneSelected;
          modalRef.componentInstance.inscription = this.currentApplicant;
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
            error : (err: HttpErrorResponse)=>{
              console.log(err);
              this.toast.error(err.error.message, 'STATUS ' + err.status);
            }
          })
        }
      }
    ];
  }
}
