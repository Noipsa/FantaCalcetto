import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchsService {

  endpoint: string = "/matchs";
  constructor(private http: HttpClient) { }

  getAllMatchs() {
    return this.http.get(environment.apiUrl + this.endpoint + "/all");
  }

  getAllGiocatoriPartita(id : number) {
    return this.http.get(environment.apiUrl + this.endpoint + "/giocatoriPartita/" + id);
  }

  getAllGiocatoriMatchs(id_squadra: number, id_giornata: number) {
    return this.http.get(environment.apiUrl + this.endpoint + "/giocatorimatchs/" + id_squadra + '/' + id_giornata );
  }
}
