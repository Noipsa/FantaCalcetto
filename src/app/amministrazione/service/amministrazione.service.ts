import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmministrazioneService {

  endpoint: string = "/";
  constructor(private http: HttpClient) { }

  getAllGiocatori() {
    return this.http.get(environment.apiUrl + this.endpoint + "giocatore/all");
  }

  calcolaGiornata() {
    return this.http.post(environment.apiUrl + this.endpoint + "matchs/calcolaGiornata", null);
  }

  insertGiocatoreValutazione(giocatore: any) {
    return this.http.post(environment.apiUrl + this.endpoint + "giocatore/inserisciValutazioneGiocatore", giocatore);
  }

  getUtenti() {
    return this.http.get(environment.apiUrl + this.endpoint + "utenti/all");
  }

  autorizzaUtente(id: number) {
    return this.http.put(environment.apiUrl + this.endpoint + "utenti/autorizza/" + id, null);
  }

  eliminaUtente(id: number) {
    return this.http.delete(environment.apiUrl + this.endpoint + "utenti/elimina/" + id);
  }
}
