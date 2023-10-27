import { Component, OnInit } from '@angular/core';
import { MatchsService } from './service/matchs.service';
import { LoaderService } from '../home/loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'matchs',
  templateUrl: './matchs.component.html',
  styleUrls: ['./matchs.component.scss']
})
export class MatchsComponent implements OnInit{
  matchsList: any = [];

  giocatori: any;

  nome_squadra: any;
  constructor(
    public matchsService: MatchsService,
    public loaderService: LoaderService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loaderService.setShow(true);
    this.matchsService.getAllMatchs().subscribe(
    (res) => { 
      this.loaderService.setShow(false);
      if(res) {
        this.matchsList = res;
      }
    },
    (err: Error) => { 
        this.loaderService.setShow(false) 
    })
  }

  consultaQuote(modal: any, id_giornata: number, id_squadra: number, nome_squadra: string) {
    this.nome_squadra = nome_squadra;
    this.matchsService.getAllGiocatoriMatchs(id_squadra, id_giornata).subscribe(
      (res) => { 
        this.loaderService.setShow(false);
        if(res) {
          this.giocatori = res;
          this.modalService.open(modal).result.then(
            () => { },
            () => { },
          );
        }
      },
      (err: Error) => { 
          this.loaderService.setShow(false) 
      })
  }
}
