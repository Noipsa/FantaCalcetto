import { Component } from '@angular/core';

@Component({
  selector: 'amministrazione',
  templateUrl: './amministrazione.component.html',
  styleUrls: ['./amministrazione.component.scss']
})
export class AmministrazioneComponent {
  utenti: any = [];
  giocatori: any = [];

  options: any = [];
  searchedOptions: any;
  giocatoreSelected: any = 'scegli giocatore';

  onSeachDropdownValue(event: any) {
    const value = event.target.value;
    this.searchedOptions = this.options.filter((option: string | any[]) => option.includes(value));
  }

  onSelectDropdownValue(option: any) {
    this.giocatoreSelected = option;
  }
}
