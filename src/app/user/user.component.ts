import { Component } from '@angular/core';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { UtenteAggiornato } from '../home/model/ResUtenteAggiornato';
import { Squadra } from '../formation/model/squadra';
import { UtenteLogin } from '../login/model/utenteLogin';
import { Router } from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  utente: UtenteLogin | undefined;
  squadra : Squadra | undefined;
  showLoader = false

  constructor (
    private utenteService:MemoryLoginService,
    private router: Router,
  ) {
    
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.utenteService.getUtenteAggiornato().subscribe((res)=>{
      this.utente = res.utente;
      this.squadra = res.squadra;
      this.showLoader = false;
    })

  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
