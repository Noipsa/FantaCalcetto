import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmministrazioneService } from './service/amministrazione.service';
import { LoaderService } from '../home/loader/loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketService } from '../market/service/market.service';
import { GiocatoreInsert } from '../market/model/giocatoreInsert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'amministrazione',
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.scss'],
})
export class AmministrazioneComponent implements OnInit {
  utenti: any = [];
  giocatori: any = [];

  options: any = [];
  searchedOptions: any;
  giocatoreSelected: any = 'scegli giocatore';
  giocatoreForm: FormGroup;

  mercatoAperto: boolean = false;

  giocatoreDaModificare: any;

  errorMessages: string[] = [];
  errorMessagesGiornata: string[] = [];
  errorMessagesValutazione: string[] = [];

  giocatoreValutazioneForm: FormGroup;

  squadraForm: FormGroup;
  squadreUfficiali: any;

  creditoForm: FormGroup;

  partitaForm: FormGroup;
  partitaRisultatiForm: FormGroup;

  partitaDaModificare: any;
  partite: any;

  constructor(
    private marketService: MarketService,
    private router: Router,
    private amministratoreService: AmministrazioneService,
    public loaderService: LoaderService,
    private modalService: NgbModal
  ) {
    this.giocatoreForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      costo: new FormControl('', Validators.required),
      ruolo: new FormControl('', Validators.required),
      squadraufficiale: new FormControl('', Validators.required),
    });

    this.giocatoreValutazioneForm = new FormGroup({
      giocatore: new FormControl(Validators.required),
      punteggio: new FormControl('', Validators.required),
    });

    this.squadraForm = new FormGroup({
      nomesquadra: new FormControl('', Validators.required)
    });

    this.creditoForm = new FormGroup({
      credito: new FormControl(Validators.required)
    });

    this.partitaForm = new FormGroup({
      id_prima_squadra: new FormControl( Validators.required),
      id_seconda_squadra: new FormControl(Validators.required),
      giornata: new FormControl(Validators.required),
      data_partita: new FormControl(Validators.required),
    });

    this.partitaRisultatiForm = new FormGroup({
      risultato_prima_squadra: new FormControl(Validators.required),
      risultato_seconda_squadra: new FormControl(Validators.required)
    });
  }

  ngOnInit(): void {
    this.loaderService.setShow(true);
    forkJoin({
      giocatori: this.amministratoreService.getAllGiocatori(),
      utenti: this.amministratoreService.getUtenti(),
      mercato: this.amministratoreService.getMercato(),
      squadre: this.amministratoreService.getAllSquadreUfficiali(),
      partite: this.amministratoreService.getPartite()
    }).subscribe(
      (res) => {
        this.searchedOptions = res.giocatori;
        this.options = res.giocatori;

        this.giocatori = res.giocatori;

        this.mercatoAperto = Boolean(res.mercato);

        this.partite = res.partite;

        this.squadreUfficiali = res.squadre;
      
        this.utenti = res.utenti;
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    );
  }

  onSeachDropdownValue(event: any) {
    const value = event.target.value.trim().toUpperCase();
    this.searchedOptions = this.options.filter((option: string | any) =>
      option.nome.includes(value)
    );
  }

  onSelectDropdownValue(option: any) {
    this.giocatoreSelected = option;
    this.giocatoreValutazioneForm.controls['giocatore'].setValue(option);
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  eliminaPartita(id_partita: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.eliminaPartita(id_partita).subscribe(
      () => {
        this.ngOnInit();
        this.partitaDaModificare = null;
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  aggiornaPartita() {
    if (this.partitaRisultatiForm.valid) {
      this.loaderService.setShow(true);
      let partitaRisultati: any = {};
      partitaRisultati.risultato_prima_squadra = Number.parseInt(
        this.partitaRisultatiForm.controls['risultato_prima_squadra'].value
      );
      partitaRisultati.risultato_seconda_squadra = Number.parseInt(
        this.partitaRisultatiForm.controls['risultato_seconda_squadra'].value
      );
      partitaRisultati.id_partita = this.partitaDaModificare.id_partita;

      this.amministratoreService.aggiornaPartita(partitaRisultati).subscribe(
        () => {
          this.ngOnInit();
          this.partitaDaModificare = null;
          this.partitaForm.controls['risultato_prima_squadra'].setValue(
            null
          );
          this.partitaForm.controls['risultato_seconda_squadra'].setValue(
            null
          );
          this.loaderService.setShow(false);
        },
        (err: Error) => {
          this.loaderService.setShow(false);
        }
      )
    }
  }

  openModaleEliminaPartita(content: any, id_partita: number){
    this.modalService.open(content).result.then(
      () => {
        this.loaderService.setShow(true);
        this.eliminaPartita(id_partita);
      },
      () => { },
    );
  }

  inserisciPartita() {
    if (this.partitaForm.valid) {
      this.loaderService.setShow(true);
      let partita: any = {};
      partita.id_prima_squadra = Number.parseInt(
        this.partitaForm.controls['id_prima_squadra'].value
      );
      partita.id_seconda_squadra = Number.parseInt(
        this.partitaForm.controls['id_seconda_squadra'].value
      );
      partita.giornata = Number.parseInt(
        this.partitaForm.controls['giornata'].value
      );
      partita.data_partita = this.partitaForm.controls['data_partita'].value
      this.amministratoreService
          .insertPartita(partita)
          .subscribe(
            () => {
              this.loaderService.setShow(false);
              this.partitaForm.controls['id_prima_squadra'].setValue(
                null
              );
              this.partitaForm.controls['id_seconda_squadra'].setValue(
                null
              );
              this.partitaForm.controls['giornata'].setValue(
                null
              );
              this.partitaForm.controls['data_partita'].setValue(
                null
              );
            },
            (err: Error) => {
              this.loaderService.setShow(false);
            }
          );
    }
  }

  inserisciValutazioneGiocatore() {
    this.errorMessagesValutazione = [];
    if (this.giocatoreValutazioneForm.valid) {
      this.loaderService.setShow(true);
      let giocatore: any = {};
      giocatore.giocatore = this.giocatoreValutazioneForm.controls['giocatore'].value;
      giocatore.valutazione = Number.parseInt(
        this.giocatoreValutazioneForm.controls['punteggio'].value
      );
      if (giocatore.valutazione != null) {
        this.amministratoreService
          .insertGiocatoreValutazione(giocatore)
          .subscribe(
            () => {
              this.loaderService.setShow(false);
              this.giocatoreSelected = 'scegli giocatore';
              this.giocatoreValutazioneForm.controls['giocatore'].setValue(
                null
              );
              this.giocatoreValutazioneForm.controls['punteggio'].setValue(
                null
              );
            },
            (err: Error) => {
              this.errorMessagesValutazione.push('ERRORE');
              this.loaderService.setShow(false);
            }
          );
      } else {
        this.errorMessagesValutazione.push('Inserisci Valutazione');
        this.loaderService.setShow(false);
      }
    } else {
      this.errorMessagesValutazione.push("Completare tutti i campi per l'inserimento");
    }
  }

  insertGiocatore () {
    this.errorMessages = [];
    if (this.giocatoreForm.valid) {
      this.loaderService.setShow(true);
      let giocatore = new GiocatoreInsert();
      giocatore.nomeGiocatore = this.giocatoreForm.controls['nome'].value;
      giocatore.ruolo = this.giocatoreForm.controls['ruolo'].value;
      giocatore.valutazione = Number.parseInt(
        this.giocatoreForm.controls['costo'].value
      );
      giocatore.id_squadra_ufficiale = Number.parseInt(
        this.giocatoreForm.controls['squadraufficiale'].value
      );
      this.marketService.insertGiocatore(giocatore).subscribe(
        () => {
          this.ngOnInit();
          this.loaderService.setShow(false);
          this.giocatoreForm.controls['nome'].setValue('');
          this.giocatoreForm.controls['ruolo'].setValue('');
          this.giocatoreForm.controls['costo'].setValue('');
          this.giocatoreForm.controls['squadraufficiale'].setValue('');
        },
        (err: Error) => {
          this.errorMessages.push('ERRORE');
          this.loaderService.setShow(false);
        }
      );
    } else {
      this.errorMessages.push("Completare tutti i campi per l'inserimento");
    }
  }

  calcolaGiornata() {
    this.loaderService.setShow(true);
    this.errorMessagesGiornata = [];
    this.amministratoreService.calcolaGiornata().subscribe(
      () => {
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.errorMessagesGiornata.push('ERRORE');
        this.loaderService.setShow(false);
      }
    )
  }

  openModalCalcolaGiornata(content: any) {
    this.modalService.open(content).result.then(
      () => {
        this.loaderService.setShow(true);
        this.calcolaGiornata();
      },
      () => { },
    );
  }

  autorizza(id: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.autorizzaUtente(id).subscribe(
      () => {
        this.ngOnInit();
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  elimina(id: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.eliminaUtente(id).subscribe(
      () => {
        this.ngOnInit();
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  eliminaGiocatore(id: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.eliminaGiocatore(id).subscribe(
      () => {
        this.ngOnInit();
        this.giocatoreDaModificare = null;
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  infortunioGiocatore(id: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.infortunioGiocatore(id).subscribe(
      () => {
        this.ngOnInit();
        this.giocatoreDaModificare = null;
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  squalificaGiocatore(id: number) {
    this.loaderService.setShow(true);
    this.amministratoreService.squalificaGiocatore(id).subscribe(
      () => {
        this.ngOnInit();
        this.giocatoreDaModificare = null;
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  apriChiudiMercato() {
    this.loaderService.setShow(true);
    this.giocatoreDaModificare = null;
    this.amministratoreService.apriChiudiMercato().subscribe(
      () => {
        this.ngOnInit();
        this.loaderService.setShow(false);
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      }
    )
  }

  insertSquadra() {
    if (this.squadraForm.valid) {
      let nome = String(this.squadraForm.controls['nomesquadra'].value != null ?
                        this.squadraForm.controls['nomesquadra'].value : "");
      this.loaderService.setShow(true);

      this.amministratoreService.insertSquadra(nome).subscribe(
        () => {
          this.ngOnInit();
          this.squadraForm.controls['nomesquadra'].setValue(null);
          this.loaderService.setShow(false);
        },
        (err: Error) => {
          this.loaderService.setShow(false);
        }
      )
    }
  }

  insertCredito() {
    if (this.creditoForm.valid) {
      let credito = Number.parseInt(
        this.creditoForm.controls['credito'].value
      );
      this.loaderService.setShow(true);

      this.amministratoreService.insertCredito(credito).subscribe(
        () => {
          this.ngOnInit();
          this.squadraForm.controls['credito'].setValue(null);
          this.loaderService.setShow(false);
        },
        (err: Error) => {
          this.loaderService.setShow(false);
        }
      )
    }
  }
}
