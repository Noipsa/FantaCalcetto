import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GiocatoreInsert } from '../model/giocatoreInsert';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  endpoint: string = "/giocatore";
  constructor(private http: HttpClient) {
  }

  getAllGiocatori() {
    return this.http.get(environment.apiUrl + this.endpoint + "/all");
  }

  buyGiocatore(giocatore: any, utente: any) {
    let request  = {
      giocatore: giocatore,
      utente: utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/buy", request);
  }

  sellGiocatore(giocatore: any, utente: any) {
    let request  = {
      giocatore: giocatore,
      utente: utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/sell", request);
  }

  insertGiocatore(giocatore:GiocatoreInsert){
    return this.http.put(environment.apiUrl + this.endpoint + "/inserisciGiocatore", giocatore);
  }
}
