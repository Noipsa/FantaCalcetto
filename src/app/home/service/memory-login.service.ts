import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemoryLoginService {
  userChange: EventEmitter<boolean> = new EventEmitter();
  adminEvent: EventEmitter<boolean> = new EventEmitter();

  utenteLoggato: any;

  endpoint: string = "/utenti";
  constructor(private http: HttpClient) { }

  setUtente(utente: any) {
    this.utenteLoggato = utente;
    this.userChange.emit(true);
  }

  getUtente() {
    return this.utenteLoggato
  }


  svuotaUtente() {
    this.utenteLoggato = null;
    this.userChange.emit(false);
  }

  getUtenteAggiornato(): Observable<any>{
    return this.http.get(environment.apiUrl + this.endpoint + "/user/" + this.utenteLoggato.id_utente);
  }

  adminLogin() {
    this.adminEvent.emit(true);
  }
}
