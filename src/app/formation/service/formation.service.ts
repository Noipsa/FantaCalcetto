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

  aggiornaFormazione(formazione: any, utente: any) {
    let request  = {
      rosa: formazione,
      utente: utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/aggiornaFormazione", request);
  }

  getClassifica() {
    return this.http.get(environment.apiUrl + this.endpoint + "/classifica");
  }

  getGiocatoriSquadra(utente: any, type: number) {
    let request  = {
      type: type,
      utente: utente
    }
    return this.http.post(environment.apiUrl + this.endpoint + "/getGiocatori", request);
  }

  getGiocatoriPosseduti(id: number) {
    return this.http.get(environment.apiUrl + this.endpoint + "/getGiocatoriPosseduti/" + id);
  }
}
