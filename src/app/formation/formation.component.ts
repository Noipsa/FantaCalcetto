import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';
import { FormationService } from './service/formation.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit{
  
  formazioni: any = {};
  formazione_titolare: any = {};
  formazioneSelected: any;

  giocatoreSelected: any;

  listGiocatori: any;

  titoloModale: String | undefined;

  

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
    public memoryLoginService: MemoryLoginService,
    private modalService: NgbModal
  ) { }
  

  ngOnInit(): void {
    this.loaderService.setShow(true);
    /*switchMap(() => forkJoin({
      formationResponse: this.formationService.getAllFormazioni().pipe(catchError(() => of(undefined)))
    }))*/
    this.formationService.getAllFormazioni().subscribe(
      (res) => { 
        this.loaderService.setShow(false);
        if(res) {
          this.formazioni = res;
        }
      },
      (err: Error) => { 
          this.loaderService.setShow(false) 
      },
      () => { this.loaderService.setShow(false) }
    )
  }

  onChangeFormation() {
    this.loaderService.setShow(true);
    if (this.formazioneSelected) {
      this.formationService.aggiornaFormazione(this.formazioneSelected, this.memoryLoginService.getUtente()).subscribe(
        (res: any) => { 
          this.loaderService.setShow(false);
          if(res) {
            this.formazione_titolare = res;
          }
        },
        (err: Error) => { 
          this.loaderService.setShow(false) ;
        },
        () => { this.loaderService.setShow(false) }
      )
    }
  }

  open(content: any, type: number) {
    this.loaderService.setShow(true);
    this.formationService.getGiocatoriSquadra(this.memoryLoginService.getUtente(), type).subscribe(
      (giocatori: any) => { 
        this.loaderService.setShow(false);
        this.listGiocatori = giocatori;
        this.titoloModale = this.getTitolo(type);
        this.modalService.open(content).result.then(
          (result) => {
            console.log(`Closed with: ${result}`);
          },
          (reason) => {
            console.log("2233");
          },
        );
      },
      (err: Error) => { 
        this.loaderService.setShow(false) ;
      },
      () => { this.loaderService.setShow(false) }
    )
	}

  getTitolo(type: number): String{
    if (type === 1) {
      return "portiere";
    } else if (type === 2) {
      return "difensori";
    } else if (type === 3) {
      return "attaccante";
    } else {
      return "";
    }
	}
}
