import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {Utility} from '../../../core/constants/utility';
import {GenderPipe} from '../../../core/pipes/gender.pipe';
import {CandidatService} from '../../../core/services/candidat.service';
import {PROFIL} from '../../../data/enums/profil';
import {STATUS_CANDIDAT} from '../../../data/enums/status';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {InscriptionDTO} from '../../../data/schemas/inscription.model';
import {InterviewModel} from '../../../data/schemas/interview.model';
import {InfoApplicantComponent} from '../info-applicant/info-applicant.component';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  @ViewChild('contentInterview') contentInterview: TemplateRef<any>;
  public allApplicants: InscriptionDTO[];
  currentApplicant: InscriptionDTO;
  isLoading = true;
  currentCampagne = Utility.CURRENTCAMPAGNE;


  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Interview des candidats'
  };

  constructor(private offcanvasService: NgbOffcanvas,
              private toast: ToastrService,
              private candidatService: CandidatService) {
  }

  ngOnInit(): void {
    this.getCandidatInterview();
  }

  getCandidatInterview(): void {
    this.isLoading = true;
    this.currentApplicant = null;
    this.allApplicants = [];
    this.offcanvasService.dismiss();
    let obs: Observable<any>;
    let status : STATUS_CANDIDAT = STATUS_CANDIDAT.INTERVIWED;
    if(Utility.loggedUser.profilActuel === PROFIL.ADMIN) {
      obs = this.candidatService.getCdtByCampagneID(Utility.CURRENTCAMPAGNE.campagneID, status);
    } else {
      obs = this.candidatService.getAllCurrentCandidatByStatus(status);
    }
    obs.subscribe({
      next: value => {
        console.log(value);
        if (value){
          this.allApplicants = (value as any as InscriptionDTO[])?.map((v) => {
            v.libelleGenre = new GenderPipe().transform(v.genreCandidat);
            v.statusVal = v.isInterviewer ? 'check-circle text-success' : 'close text-danger';
            // Object.assign(v, v.candidat);
            return v;
          });
        }
        this.isLoading = false;
      }, error: err => {
        this.isLoading = false;
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }

  // openInfo(content: TemplateRef<any>) {
  //   let cn = this.offcanvasService.open(InfoApplicantComponent, {position: 'start'});
  //   cn.componentInstance.candidatInfo = this.currentApplicant;
  //
  //   // this.offcanvasService.open(content, { position: 'start'});
  // }


  openInterview(content: TemplateRef<any>, cdt: InscriptionDTO) {
    this.currentApplicant = cdt;
    Object.assign(this.currentApplicant, cdt.candidat);
    this.offcanvasService.open(content, {position: 'end'});
  }

  confirmValidation(): void {
    if(!this.currentApplicant.isInterviewer) {
      this.toast.warning('Ce candidat n\'est pas encore interviewé!')
      return;
    }
    Swal.fire({
      title: 'Validation interview',
      text: 'Voulez-vous vraiment valider cet interview?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Non!'
    }).then(result => {
      if (result.value) {
       this.validateInterView();
      }
    });
  }

  validateInterView(): void {
    this.candidatService.validateInterview(this.currentApplicant.inscriptionID, true).subscribe({
      next: value => {
        this.toast.success('Interview candidat validé avec succès');
        this.getCandidatInterview();
        console.log(value);
      }, error: err => {
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.log(err);
      }
    });

  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Details',
        isMatDesign: true,
        icon: 'info',
        color: 'primary',
        className: 'text-uppercase',
        click: (item) => {
          this.currentApplicant = item;
          // this.openInfo(this.contentInterview);
          console.log(item);
        }
      },
      // {
      //   title: 'Modifier',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // },
      // {
      //   title: 'Supprimer',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // }
    ];
  }

}
