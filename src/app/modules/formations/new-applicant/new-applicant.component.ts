import {CdkStepper} from '@angular/cdk/stepper';
import {AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
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
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';

@Component({
  selector: 'app-new-applicant',
  templateUrl: './new-applicant.component.html',
  styleUrls: ['./new-applicant.component.scss']
})
export class NewApplicantComponent implements OnInit, AfterViewInit {
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @Input() name;
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;

  localForm : FormGroup;
  _yearPickerCtrl: FormControl = new FormControl();
  idForm : FormGroup;
  trainingForm : FormGroup;
  jobForm : FormGroup;
  motivationForm : FormGroup;

  campgne : Campagne;
  candidat : Candidat;

  // campgne : Campagne;
  listCandidats : Candidat[] = [];

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

  motivationSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.allMotivations
        : this.allMotivations.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  };


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

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private candidatService : CandidatService) {
  }

  ngOnInit(): void {

  }

  initForm(): void {
    this.localForm.reset();
    this.localForm = this.fb.group({
      poste: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      district: ['', [Validators.required]],
      numero: ['', [Validators.required]],
    });


    this.idForm.reset();
    this.idForm = this.fb.group({
      nom : ['',Validators.required],
      prenom : ['',Validators.required],
      sexe : ['',Validators.required],
      dateNaissance : ['',Validators.required],
      lieuNaissance : ['',Validators.required],
      niveauEtude : ['',Validators.required],
      metierActuel : ['',Validators.required],
      lieuResidence : ['',Validators.required],
      distanceEcole : ['',Validators.required],
      contact1 : ['',Validators.required],
      pieceId : ['',Validators.required],
      numeroPiece : ['',Validators.required],
    });


    this.trainingForm.reset();


    this.jobForm.reset();


    this.motivationForm.reset();
    this.motivationForm = this.fb.group({
      motivation : ['', Validators.required]
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

    this.cdkStepper.selectionChange.subscribe((c)=> {
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
}
