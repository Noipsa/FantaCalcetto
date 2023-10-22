import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';
import { FormationService } from './service/formation.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitolariService } from './service/titolari.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss'],
})
export class FormationComponent implements OnInit {
  formazioni: any = {};
  formazione_titolare: any = {};
  formazioneSelected: any;
  userFormation: any;

  giocatoreSelected: any;

  listGiocatori: any;

  titoloModale: String | undefined;

  portieri: any;
  difensori: any;
  attaccanti: any;
  giocatoriPosseduti: any;

  orarioPartita: Date = new Date();

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
    public memoryLoginService: MemoryLoginService,
    public titolariService: TitolariService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loaderService.setShow(true);
    forkJoin({
      formazioni: this.formationService.getAllFormazioni(),
      utente: this.memoryLoginService.getUtenteAggiornato(),
      giocatori: this.formationService.getGiocatoriPosseduti(
        this.memoryLoginService.getUtenteId()
      ),
      partita_giornata: this.formationService.getOrarioPrimaPartitaGiornata(),
    }).subscribe(
      (res) => {
        if (res) {
          this.userFormation = res.utente.squadra?.id_formazione;
          this.formazioni = res.formazioni;

          this.orarioPartita = new Date(String(res.partita_giornata));

          this.giocatoriPosseduti = res.giocatori;

          this.isLimitToInsertFormation();

          if (this.userFormation != null) {
            this.formazioni.forEach((form: any) => {
              if (form.id_formazione === this.userFormation) {
                this.formazioneSelected = form;
                this.onChangeFormation();
              } else {
                this.loaderService.setShow(false);
              }
            });
          } else {
            this.loaderService.setShow(false);
          }
        }
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      },
      () => {}
    );
  }

  onChangeFormation() {
    this.loaderService.setShow(true);
    let id_utente = this.memoryLoginService.getUtenteId();
    if (this.formazioneSelected) {
      this.formationService
        .aggiornaFormazione(this.formazioneSelected, id_utente)
        .subscribe(
          (res: any) => {
            this.loaderService.setShow(false);
            if (res) {
              this.formazione_titolare = res;
              this.attaccanti = this.formazione_titolare.attaccanti;
              this.difensori = this.formazione_titolare.difensori;
              this.portieri = this.formazione_titolare.portieri;
              this.richiamaFormazioneTitolare(id_utente);
            }
          },
          (err: Error) => {
            this.loaderService.setShow(false);
          },
          () => {}
        );
    }
  }

  open(content: any, type: number) {
    this.loaderService.setShow(true);
    this.formationService
      .getGiocatoriSquadra(this.memoryLoginService.getUtente(), type)
      .subscribe(
        (giocatori: any) => {
          this.loaderService.setShow(false);
          this.listGiocatori = giocatori;
          this.titoloModale = this.getTitolo(type);
          this.modalService.open(content).result.then(
            () => {
              this.loaderService.setShow(false);
              this.salvaGiocatoreTitolare(this.giocatoreSelected);
            },
            () => {}
          );
        },
        (err: Error) => {
          this.loaderService.setShow(false);
        },
        () => {}
      );
  }

  getTitolo(type: number): String {
    if (type === 1) {
      return 'portiere';
    } else if (type === 2) {
      return 'difensori';
    } else if (type === 3) {
      return 'attaccante';
    } else {
      return '';
    }
  }

  inserisciFormazione() {
    this.loaderService.setShow(true);
    let id_utente = this.memoryLoginService.getUtenteId();
    this.formationService.insertFormazioneTitolare(id_utente).subscribe(
      () => {
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    );
  }

  salvaGiocatoreTitolare(giocatoreSelected: any) {
    this.loaderService.setShow(true);
    let id_utente = this.memoryLoginService.getUtenteId();
    this.titolariService
      .aggiornaTitolari(giocatoreSelected, id_utente)
      .subscribe(
        () => {
          this.loaderService.setShow(false);
          this.richiamaFormazioneTitolare(id_utente);
        },
        (err: Error) => {
          this.loaderService.setShow(false);
        },
        () => {}
      );
  }

  richiamaFormazioneTitolare(id: number) {
    this.loaderService.setShow(true);
    this.titolariService.getTitolari(id).subscribe(
      (res: any) => {
        this.loaderService.setShow(false);
        this.formazione_titolare = res;
        this.attaccanti = this.formazione_titolare.attaccanti;
        this.difensori = this.formazione_titolare.difensori;
        this.portieri = this.formazione_titolare.portieri;
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      },
      () => {}
    );
  }

  isLimitToInsertFormation(): boolean{
    let date = new Date();
    date.setHours(date.getHours() - 1);
    return this.orarioPartita.getTime() < date.getTime();
  }
}
