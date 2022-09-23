import {CdkStepper} from '@angular/cdk/stepper';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable, of,
  OperatorFunction,
  Subject, switchMap,
  tap
} from 'rxjs';
import {CandidatService} from '../../../core/services/candidat.service';
import {ParamsService} from '../../../core/services/params.service';
import {PosteService} from '../../../core/services/poste.service';
import {ZoneService} from '../../../core/services/zone.service';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';
import {Params} from '../../../data/schemas/params';
import {PosteModel} from '../../../data/schemas/poste.model';
import {ZoneApromac} from '../../../data/schemas/zone-apromac';

@Component({
  selector: 'app-new-applicant',
  templateUrl: './new-applicant.component.html',
  styleUrls: ['./new-applicant.component.scss']
})
export class NewApplicantComponent implements OnInit, AfterViewInit {
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @Input() name;
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;

  @Output() inscriptionEnd = new EventEmitter<any>();

  localForm: FormGroup;
  _yearPickerCtrl: FormControl = new FormControl();
  idForm: FormGroup;
  trainingForm: FormGroup;
  jobForm: FormGroup;
  motivationForm: FormGroup;

  campgne: Campagne;
  candidat: Candidat;
  posteSelected: PosteModel = {};

  // campgne : Campagne;
  listCandidats: Candidat[] = [];
  listZone: ZoneApromac[] = [];
  listMotivations: Params[] = [];
  listPostes: PosteModel[] = [];

  touchUi = false;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  currentIndex = 0;
  motivation: any;
  trained = false;
  practice = false;
  isActive = false;
  propositionEmploi = false;

  searchingCdt = false;
  searchCdtFailed = false;

  maxBirthday = moment().subtract({
    y: 5,
    day: 0
  }).format('YYYY-MM-DD');

  typePiece: 'attestation' | 'cni' | 'autre' = 'cni';
  typeFormations: any[] = ['Saigneur', 'Planteur', 'Autre'];
  allMotivations: any[] = ['Saigner votre propre plantation',
    'Saigner la plantation d\'un proche',
    // 'Exercer le métier de saigneur dans une autre plantation',
    // 'Contrôler la saignée dans votre plantation',
    // 'Autre',
  ];

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    // const arrays = this.currentIndex === 5 ? this.allMotivations : this.typeFormations;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.typeFormations
        : this.typeFormations.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  };

  motivationSearch: OperatorFunction<string, readonly Params[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.listMotivations
        : this.listMotivations.filter(v => v.description.toLowerCase().indexOf((term as string).toLowerCase()) > -1)).slice(0, 10))
    );
  };
  formatter = (x: Params) => x.description;


  searchUser: OperatorFunction<string, readonly Candidat[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchingCdt = true),
      switchMap(term =>
        this.candidatService.search(term).pipe(
          tap(() => this.searchCdtFailed = false),
          catchError(() => {
            this.searchCdtFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searchingCdt = false)
    );

  currentYear = new Date().getFullYear();

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private zoneService: ZoneService,
              private paramsService: ParamsService,
              private posteService: PosteService,
              private toast: ToastrService,
              private candidatService: CandidatService) {
  }

  ngOnInit(): void {
    this.fetchCombosData();

    this.initForm();
    this.localForm.controls['poste'].valueChanges.subscribe((val) => {
      this.posteSelected = this.listPostes.find((p) => p.posteID == val);
      console.log(this.localForm);
      // this.localForm.controls['zone'].setValue(this.posteSelected.zoneID);
      // this.localForm.controls['district'].setValue(this.posteSelected.district.districtID);
    });
  }

  fetchCombosData() {
    /**
     * fill Zone
     */
    this.zoneService.getAllZone().subscribe({
      next: (resp) => {
        console.log(resp);
        this.listZone = (resp as any as ZoneApromac[]);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });

    /**
     * motivation
     */

    this.paramsService.getAllMotivation().subscribe({
      next: (resp) => {
        console.log(resp);
        this.listMotivations = (resp as Params[]);
        // this.listZone = (resp as any as ZoneApromac[])
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });

    this.posteService.getPosteByProfil(4).subscribe({
      next: value => {
        console.log(value);
        this.listPostes = value as any as PosteModel[];
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Une erreur s\'est produite lors de la récupération des postes', 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }

  initForm(): void {

    this.localForm = this.fb.group({
      poste: ['', [Validators.required]],
      nom: [''],
      prenom: [''],
      zone: ['', [Validators.required]],
      district: ['', [Validators.required]],
      numero: [''],
    });


    this.idForm = this.fb.group({
      nomCandidat: ['', Validators.required],
      prenomsCandidat: ['', Validators.required],
      genreCandidat: [0, Validators.required],
      dateNaisCandidat: ['', Validators.required],
      lieuNaisCandidat: ['', Validators.required],
      niveauEtudeCandidat: [0, Validators.required],
      metierActuelCandidat: [0, Validators.required],
      lieuResidCandidat: [1, Validators.required],
      distanceEcoleCandidat: ['', Validators.required],
      premierContactCandidat: ['', Validators.required],
      secondContactCandidat: ['', Validators.required],
      typePieceCandidat: [0, Validators.required],
      numeroPieceCandidat: ['', Validators.required],
    });


    // this.trainingForm.reset();
    //
    //
    // this.jobForm.reset();
    //
    //
    // this.motivationForm.reset();
    this.motivationForm = this.fb.group({
      motivation: ['', Validators.required]
    });


  }

  motivationChange(e): void {
    console.log(e);
    this.motivation = e;
  }

  alreadyTrainedChange(e): void {
    console.log(e);
    this.trained = e;
    // this.motivation = e;
  }

  trainedAndPractice(e): void {
    console.log(e);
    this.practice = e;
    // this.motivation = e;
  }


  ngAfterViewInit(): void {

    this.cdkStepper.selectionChange.subscribe((c) => {
      console.log(c, this.cdkStepper._getFocusIndex());
      this.currentIndex = c.selectedIndex;

    });
  }

  getRangeDate(e): void {
    console.log(e);
  }

  typePieceChange($e): void {
    console.log($e);
    this.typePiece = $e;
  }

  saveForms(): void {
    console.log(this.idForm.value, this.localForm.value);
    let dataToSend = this.idForm.value;
    // Object.assign(dataToSend, ...this.localForm.value)
    this.candidatService.addCandidat(dataToSend).subscribe({
      next : value => {
        console.log(value);
        this.toast.success('Candidat inscrit avec succès');
        this.inscriptionEnd.emit();
        this.activeModal.dismiss();
      },
      error : (err : HttpErrorResponse)=>{
        console.log(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    })

    // console.log(dataToSend);
  }
}
