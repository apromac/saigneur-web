import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {GenderPipe} from '../../../core/pipes/gender.pipe';
import {CandidatService} from '../../../core/services/candidat.service';
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
  public allApplicants: InterviewModel[];
  currentApplicant: InterviewModel;
  isLoading = true;

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
    this.candidatService.getAllCurrentCandidatByStatus(STATUS_CANDIDAT.SELECTED).subscribe({
      next: value => {
        console.log(value);
        if (value){
          this.allApplicants = (value as any as InscriptionDTO[])?.map((v) => {
            v.genreCandidat = new GenderPipe().transform(v.genreCandidat);
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


  openInterview(content: TemplateRef<any>, cdt: InterviewModel) {
    this.currentApplicant = cdt;
    Object.assign(this.currentApplicant, cdt.candidat);
    this.offcanvasService.open(content, {position: 'end'});
  }

  confirmValidation(): void {
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
    this.candidatService.validateInterview(this.currentApplicant.candidatID, true).subscribe({
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
