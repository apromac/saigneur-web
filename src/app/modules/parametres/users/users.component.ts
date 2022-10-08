import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ProfilService} from 'src/app/core/services/profil.service';
import {PosteService} from '../../../core/services/poste.service';
import {UserService} from '../../../core/services/user.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';
import {PosteModel} from '../../../data/schemas/poste.model';
import {UsersModel} from '../../../data/schemas/users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public allUsers: UsersModel[] = [];
  public allPoste: PosteModel[] = [];
  isLoading = false;

  currentUser: UsersModel = {};

  formGroup: FormGroup;
  posteFormGroupe: FormGroup;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private posteService: PosteService,
              private profilService: ProfilService,
              private userService: UserService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouvel utilisateur',
    },
    btnClick: () => {
      this.currentUser = new UsersModel();
      document.getElementById('btnmodal').click();
    },
    title: 'Liste des utilisateurs',
  };

  initForm(): void {
    this.formGroup = this.fb.group({
      nomUtilisateur: [this.currentUser?.nomUtilisateur, Validators.required],
      prenomsUtilisateur: [this.currentUser?.prenomsUtilisateur, Validators.required],
      password: [this.currentUser?.password, Validators.required],
      confPassword: [this.currentUser?.password, Validators.required],
      // poste: [, Validators.required],
      username: [this.currentUser?.username, Validators.required],
      utilisateurID: [this.currentUser?.utilisateurID, Validators.required],
    });

  }

  getAllUser(): void {
    this.isLoading = true;
    this.allUsers = [];
    this.userService.getAllUser().subscribe({
      next: (resp) => {
        console.log(resp);
        this.isLoading = false;
        this.allUsers = (resp as any as UsersModel[])/*.map((u) => {
            let user = u;
            user.postLabel = (u as any).profil?.libelleProfil;
            // user.postLabel = u.poste?.libellePoste
            return user;
          }
        )*/;
      }, error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getAllPost(): void {
    this.posteService.getAllPoste().subscribe({
      next: value => {
        console.log(value);
        this.allPoste = value as any as PosteModel[];
      }
    });
  }

  openModal(modal): void {
    this.initForm();
    const modalRef = this.modalService.open(modal, {centered: true, size: 'lg', backdrop: 'static'});
    // modalRef.componentInstance.name = 'World';
  }

  close(): void {
    console.log(this.formGroup.value);
    // this.modalService.dismissAll();
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      // {
      //   title: 'Détails',
      //   isMatDesign: true,
      //   className: 'h3',
      //   icon: 'person',
      //   color: 'var(--bs-primary)',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // },
      {
        title: 'Attribuer poste',
        isMatDesign: true,
        className: 'h3 hover-white',
        icon: 'assignment_turned_in',
        color: 'var(--bs-dark)',
        click: (item) => {
          this.currentUser = item;
          this.getAllPost();
          this.initPosteForm();
          document.getElementById('btnmodalposte').click();
          console.log(item);
        }
      },
      {
        title: 'Modifier',
        isMatDesign: true,
        className: 'h3',
        icon: 'edit',
        color: 'var(--bs-primary)',
        click: (item) => {
          this.currentUser = item;
          document.getElementById('btnmodal').click();
          console.log(item);
        }
      },
      {
        title: 'Supprimer',
        isMatDesign: true,
        className: 'h3',
        icon: 'delete',
        color: 'red',
        click: (item) => {

          console.log(item);
        }
      },
    ];
  }

  initPosteForm(): void {
    this.posteFormGroupe = this.fb.group({
      poste: ['', Validators.required],
      zoneOccuper: ['', Validators.required],
      districtOccuper: ['', Validators.required],
      motifOccuper: [''],
      dateOccuper: ['', Validators.required],
      utilisateur: '',
    });
    this.posteFormGroupe.reset();
    this.posteFormGroupe.controls['utilisateur'].setValue(this.currentUser);

    this.posteFormGroupe.controls['poste'].valueChanges.subscribe((v) => {
      console.log(v);
      if(!v) {
        this.posteFormGroupe.controls['zoneOccuper'].setValue('');
        this.posteFormGroupe.controls['districtOccuper'].setValue('');
        return;
      }
      this.posteService.getDTOById(v.posteID).subscribe({
        next: value => {
          console.log(value);
          const v = value as any;
          this.posteFormGroupe.controls['zoneOccuper'].setValue(v.zoneBean);
          this.posteFormGroupe.controls['districtOccuper'].setValue(v.districtBean);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.toast.error(err.error.message, 'STATUS ' + err.status);
        }
      });
    });
  }

  saveUser(): void {
    console.log(this.formGroup);

   let obs : Observable<any>
    if(this.currentUser && this.currentUser.utilisateurID) {
      obs = this.userService.editUser(this.formGroup.value)
    } else {
    obs = this.userService.createUser(this.formGroup.value);
    }
      obs.subscribe({
      next: value => {
        console.log(value);
        this.getAllUser();
        this.modalService.dismissAll();
        this.toast.success('Utilisateur ajouté avec succès', 'Création d\'utilisateur');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      },
      complete: () => {

      }
    });
  }

  savePoste(): void {
    console.log(this.posteFormGroupe);
    this.currentUser.poste = this.posteFormGroupe.value['poste'];
    console.log(this.posteFormGroupe.value);
    this.userService.addPoste(this.posteFormGroupe.value).subscribe({
      next: value => {
        console.log(value);
        this.getAllUser();
        this.modalService.dismissAll();
        this.toast.success('Poste attribué avec succès', 'Attribution de poste');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS' + err.status);
      },
      complete: () => {

      }
    });
  }
}
