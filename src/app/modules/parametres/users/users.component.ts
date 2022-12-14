import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ProfilService} from 'src/app/core/services/profil.service';
import Swal from 'sweetalert2';
import {PosteService} from '../../../core/services/poste.service';
import {UserService} from '../../../core/services/user.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';
import {OccuperModel} from '../../../data/schemas/occuper.model';
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
  currentPoste: PosteModel = {};

  formGroup: FormGroup;
  posteFormGroupe: FormGroup;
  currentOccuper: OccuperModel = {};

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private posteService: PosteService,
              private profilService: ProfilService,
              private userService: UserService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.initPosteForm();
    this.initForm();
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
      nomUtilisateur: [this.currentUser?.nomUtilisateur, [Validators.required]],
      prenomsUtilisateur: [this.currentUser?.prenomsUtilisateur, [Validators.required]],
      password: [this.currentUser?.password, [Validators.required]],
      confPassword: [this.currentUser?.password, [Validators.required]],
      // poste: [, Validators.required],
      username: [this.currentUser?.username, [Validators.required]],
      telephoneUtilisateur: [this.currentUser?.telephoneUtilisateur],
      utilisateurID: [this.currentUser?.utilisateurID],
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
      {
        title: 'Attribuer poste',
        isMatDesign: true,
        className: 'h3 hover-white',
        icon: 'assignment_turned_in',
        color: 'var(--bs-dark)',
        click: (item) => {
          this.currentUser = item;
          this.getAllPost();
          this.getUserPost();
          // this.initPosteForm();
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

          Swal.fire({
            title: 'SUPPRESSION DE COMPTE UTILISATEUR',
            text: 'Voulez-vous vraiment supprimer ce compte?',
            icon: 'question',
            showCloseButton : true,
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'OUI',
            cancelButtonText: 'NON'
          }).then(result => {
            console.log(result);
            if (result.value) {
              console.log(item);
              this.userService.delete(item).subscribe({
                next: value => {
                  this.toast.success('Compte supprim?? avec succ??s');
                  this.getAllUser();
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err);
                  this.toast.error(err.error.message, 'STATUS ' + err.status);
                }
              });
            }
          });

        }
      },
    ];
  }

  initPosteForm(): void {
    this.posteFormGroupe = this.fb.group({
      poste: [this.currentOccuper?.poste || '', Validators.required],
      zoneOccuper: [this.currentOccuper?.zoneOccuper, Validators.required],
      districtOccuper: [this.currentOccuper?.districtOccuper, Validators.required],
      motifOccuper: [this.currentOccuper?.motifOccuper],
      dateOccuper: [this.currentOccuper?.dateOccuper, Validators.required],
      utilisateur: this.currentOccuper?.utilisateur,
    });
    // this.posteFormGroupe.reset();
    this.posteFormGroupe.controls['utilisateur'].setValue(this.currentUser);

    this.posteFormGroupe.controls['poste'].valueChanges.subscribe((v) => {
      console.log(v);
      if (!v) {
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

  getUserPost() {
    this.userService.getUserPoste(this.currentUser.utilisateurID).subscribe({
      next: value => {
        this.currentOccuper = value as unknown as OccuperModel;
        this.initPosteForm();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.message, 'STATUS '+err.status )
      },
    });
  }

  saveUser(): void {
    console.log(this.formGroup);
    if (this.formGroup.controls['confPassword'].value !== this.formGroup.controls['password'].value) {
      this.toast.warning('Les mots de passe ne correspondent pas');
      return;
    }

    let obs: Observable<any>;
    let user: UsersModel = this.formGroup.value;
    user.nomUtilisateur.toUpperCase();
    // user.prenomsUtilisateur.charAt(0).toUpperCase();
    var newPren = '';
    var prenom = user.prenomsUtilisateur.toString().trimEnd().split(' ');
    prenom.forEach((c) => {
      c.charAt(0).toUpperCase();
      newPren += c + ' ';
    });
    user.prenomsUtilisateur = newPren.toString().trimEnd();
    console.log(user);
    if (this.currentUser && this.currentUser.utilisateurID) {
      obs = this.userService.editUser(user);
    } else {
      obs = this.userService.createUser(user);
    }

    obs.subscribe({
      next: value => {
        console.log(value);
        this.getAllUser();
        this.modalService.dismissAll();
        this.toast.success('Utilisateur ajout?? avec succ??s', 'Cr??ation d\'utilisateur');
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
    console.log(this.posteFormGroupe.value, this.currentOccuper);
    if(!this.currentOccuper) {
      this.currentOccuper = {};
    }
    this.currentOccuper.dateOccuper = this.posteFormGroupe.value['dateOccuper'];
    this.currentOccuper.poste = this.posteFormGroupe.value['poste'];
    this.currentOccuper.zoneOccuper = this.posteFormGroupe.value['zoneOccuper'];
    this.currentOccuper.motifOccuper = this.posteFormGroupe.value['motifOccuper'];
    this.currentOccuper.districtOccuper = this.posteFormGroupe.value['districtOccuper'];
    this.currentOccuper.utilisateur = this.posteFormGroupe.value['utilisateur'];

    this.userService.addPoste(this.currentOccuper).subscribe({
      next: value => {
        console.log(value);
        this.getAllUser();
        this.modalService.dismissAll();
        this.toast.success('Poste attribu?? avec succ??s', 'Attribution de poste');
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
