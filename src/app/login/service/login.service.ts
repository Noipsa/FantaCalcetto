import { Injectable } from '@angular/core';
import { UtenteLogin } from '../model/utenteLogin';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  endpoint: string = "/utenti";
  constructor(private http: HttpClient) { }

  login(utente: UtenteLogin) {
    return this.http.post(environment.apiUrl + this.endpoint + "/login", utente);
  }
}
