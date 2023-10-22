import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitolariService {

  endpoint: string = "/titolari";
  constructor(private http: HttpClient) {
  }

  aggiornaTitolari(giocatore: any, id_utente: any) {
    let request  = {
      giocatore: giocatore,
      id_utente: id_utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/save", request);
  }

  getTitolari(id: number) {
    return this.http.get(environment.apiUrl + this.endpoint + "/get/" + id);
  }
}
