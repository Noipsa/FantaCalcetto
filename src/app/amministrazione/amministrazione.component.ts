import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmministrazioneService } from './service/amministrazione.service';
import { LoaderService } from '../home/loader/loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketService } from '../market/service/market.service';
import { GiocatoreInsert } from '../market/model/giocatoreInsert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  errorMessages: string[] = [];
  errorMessagesGiornata: string[] = [];

  giocatoreValutazioneForm: FormGroup;

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
    });

    this.giocatoreValutazioneForm = new FormGroup({
      giocatore: new FormControl(),
      punteggio: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.amministratoreService.getAllGiocatori().subscribe(
      (res) => {
        this.loaderService.setShow(false);
        this.searchedOptions = res;
        this.options = res;
      },
      (err: Error) => {
        this.loaderService.setShow(false);
      },
      () => {
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

  insertGiocatore() {
    this.errorMessages = [];
    if (this.giocatoreForm.valid) {
      this.loaderService.setShow(true);
      let giocatore = new GiocatoreInsert();
      giocatore.nomeGiocatore = this.giocatoreForm.controls['nome'].value;
      giocatore.ruolo = this.giocatoreForm.controls['ruolo'].value;
      giocatore.valutazione = Number.parseInt(
        this.giocatoreForm.controls['costo'].value
      );
      this.marketService.insertGiocatore(giocatore).subscribe(
        () => {
          this.loaderService.setShow(false);
          this.giocatoreForm.controls['nome'].setValue('');
          this.giocatoreForm.controls['ruolo'].setValue('');
          this.giocatoreForm.controls['costo'].setValue('');
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
}
