import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { FormationService } from '../formation/service/formation.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { UtenteLogin } from '../login/model/utenteLogin';
import { Squadra } from '../formation/model/squadra';

@Component({
  selector: 'classified',
  templateUrl: './classified.component.html',
  styleUrls: ['./classified.component.scss']
})
export class ClassifiedComponent implements OnInit{
  squadre: any;
  utente: UtenteLogin | undefined;
  team : Squadra | undefined;

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
    private utenteService:MemoryLoginService,
  ) {

  }

  ngOnInit(): void {
    this.loaderService.setShow(true);
    this.utenteService.getUtenteAggiornato().subscribe((res)=>{
      this.utente = res.utente;
      this.team = res.squadra;
    })
    this.formationService.getClassifica().subscribe(
      (res: any) => { 
        this.loaderService.setShow(false);
        this.squadre = res;
      },
      (err: Error) => { 
          this.loaderService.setShow(false);
      },
      () => { }
    )
  }
}
