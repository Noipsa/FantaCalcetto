import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { FormationService } from '../formation/service/formation.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { TitolariService } from '../formation/service/titolari.service';
import { MatchsService } from '../matchs/service/matchs.service';

@Component({
  selector: 'match-of-day',
  templateUrl: './match-of-day.component.html',
  styleUrls: ['./match-of-day.component.scss']
})
export class MatchOfDayComponent implements OnInit{

  giocatoriPosseduti: any;

  portieri: any;
  difensori: any;
  attaccanti: any;

  riserve: any;

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
    public memoryLoginService: MemoryLoginService,
    public titolariService: TitolariService,
    public matchsService: MatchsService,
  ) { }

  ngOnInit(): void {
    this.richiamaFormazioneTitolare(this.memoryLoginService.getUtenteId());
  }

  richiamaFormazioneTitolare(id: number) {
    this.loaderService.setShow(true);
    this.matchsService.getAllGiocatoriPartita(id).subscribe(
      (res: any) => { 
        let titolari = res.titolari;
        this.attaccanti = titolari.attaccanti;
        this.difensori = titolari.difensori;
        this.portieri = titolari.portieri;
        this.riserve = res.riserve;
        
      },
      (err: Error) => { this.loaderService.setShow(false) ;
      },
      () => { this.loaderService.setShow(false) }
    )
  }
}
