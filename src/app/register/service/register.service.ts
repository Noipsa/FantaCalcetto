import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utente } from '../model/utente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  endpoint: string = "/utenti";
  constructor(private http: HttpClient) { }

  saveUser(utente: Utente) {
    return this.http.post(environment.apiUrl + this.endpoint + "/save", utente);
  };
}
