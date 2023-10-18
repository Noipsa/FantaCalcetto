import { Component, OnInit } from '@angular/core';
import { MatchsService } from '../matchs/service/matchs.service';
import { LoaderService } from '../home/loader/loader.service';
import { MarketService } from './service/market.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { forkJoin, switchMap, tap } from 'rxjs';

@Component({
  selector: 'market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit{
  giocatori: any = [];
  giocatoriAttualiSquadra: any = [];

  constructor(
    public marketService: MarketService,
    public loaderService: LoaderService,
    public memoryLoginService: MemoryLoginService
  ) { }

  ngOnInit(): void {
    this.loaderService.setShow(true);
    forkJoin({
      giocatori: this.marketService.getAllGiocatori(),
      utente: this.memoryLoginService.getUtenteAggiornato()
    }).subscribe(
    (res) => { 
      if(res) {
        this.giocatoriAttualiSquadra = res.utente.id_squadra.giocatori_acquistati;
        this.giocatori = res.giocatori;
      }
      this.loaderService.setShow(false);
    },
    (err: Error) => { 
        this.loaderService.setShow(false) 
    },
    () => { this.loaderService.setShow(false) })
  }

  buy(giocatore: any) {
    this.loaderService.setShow(true);
    this.marketService.buyGiocatore(giocatore, this.memoryLoginService.getUtente()).subscribe(
      (res) => { 
        this.loaderService.setShow(false);
        this.giocatoriAttualiSquadra = res;
      },
      (err: Error) => { 
          this.loaderService.setShow(false) 
      },
      () => { this.loaderService.setShow(false) })
  }

  sellgiocatore(giocatore: any) {
    this.loaderService.setShow(true);
    this.marketService.sellGiocatore(giocatore, this.memoryLoginService.getUtente()).subscribe(
      (res) => { 
        this.loaderService.setShow(false);
        this.giocatoriAttualiSquadra = res;
      },
      (err: Error) => { 
          this.loaderService.setShow(false) 
      },
      () => { this.loaderService.setShow(false) })
  }

  giaPresente(giocatore_id: any): boolean {
    let found = false
    if(this.giocatoriAttualiSquadra) {
      this.giocatoriAttualiSquadra.forEach((giocatore: any) => {
        if(giocatore.id_giocatore ===   giocatore_id) {
          found = true;
        }
      });
    } 
    return found;
  }
}
