import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  endpoint: string = "/formation";
  constructor(private http: HttpClient) {
  }

  getAllFormazioni() {
    return this.http.get(environment.apiUrl + this.endpoint + "/all");
  }

  getOrarioPrimaPartitaGiornata() {
    return this.http.get(environment.apiUrl + this.endpoint + "/primapartita");
  }

  aggiornaFormazione(formazione: any, id_utente: number) {
    let request  = {
      rosa: formazione,
      id_utente: id_utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/aggiornaFormazione", request);
  }

  getClassifica() {
    return this.http.get(environment.apiUrl + this.endpoint + "/classifica");
  }

  getGiocatoriSquadra(utente: any, type: number) {
    let utenteConcatenato = utente;
    if(utente.utente) {
      utenteConcatenato = utente.utente;
    }
    let request  = {
      type: type,
      utente: utenteConcatenato
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/getGiocatori", request);
  }

  getGiocatoriPosseduti(id: number) {
    return this.http.get(environment.apiUrl + this.endpoint + "/getGiocatoriPosseduti/" + id);
  }

  insertFormazioneTitolare(id: number) {
    return this.http.post(environment.apiUrl + this.endpoint + "/inserisciFormazioneTitolare/" + id, null);
  }
}
