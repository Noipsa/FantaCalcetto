import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketService } from '../market/service/market.service';
import { GiocatoreInsert } from '../market/model/giocatoreInsert';

@Component({
  selector: 'amministrazione',
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.scss']
})
export class AmministrazioneComponent {
  utenti: any = [{}];
  giocatori: any = [{}];

  options: any = [];
  searchedOptions: any;
  giocatoreSelected: any = 'scegli giocatore';
  giocatoreForm: FormGroup;
  errorMessages :string[]= [];

  constructor (
    private marketService:MarketService
  ) {
    this.giocatoreForm = new FormGroup({
      nome: new FormControl('',Validators.required),
      costo: new FormControl('',Validators.required),
      ruolo: new FormControl('',Validators.required),
    });
  }

  onSeachDropdownValue(event: any) {
    const value = event.target.value;
    this.searchedOptions = this.options.filter((option: string | any[]) => option.includes(value));
  }

  onSelectDropdownValue(option: any) {
    this.giocatoreSelected = option;
  }

  insertGiocatore(){
    this.errorMessages = [];
    if(this.giocatoreForm.valid){
      let giocatore = new GiocatoreInsert();
    giocatore.nomeGiocatore = this.giocatoreForm.controls['nome'].value;
    giocatore.ruolo = this.giocatoreForm.controls['ruolo'].value;
    giocatore.valutazione = Number.parseInt(this.giocatoreForm.controls['costo'].value);
    this.marketService.insertGiocatore(giocatore).subscribe((res)=>{
        this.giocatoreForm.controls['nome'].setValue('');
        this.giocatoreForm.controls['ruolo'].setValue('');
        this.giocatoreForm.controls['costo'].setValue('');
    },
    (err: Error) => this.errorMessages.push("ERRORE"))
  } else {
    this.errorMessages.push("Completare tutti i campi per l'inserimento")
  }
    
  }
}
