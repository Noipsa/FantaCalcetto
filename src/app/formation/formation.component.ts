import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';
import { FormationService } from './service/formation.service';
import { MemoryLoginService } from '../home/service/memory-login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitolariService } from './service/titolari.service';

@Component({
  selector: 'formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit{
  
  formazioni: any = {};
  formazione_titolare: any = {};
  formazioneSelected: any;
  userFormation: any;

  giocatoreSelected: any;

  listGiocatori: any;

  titoloModale: String | undefined;
  
  portieri: any;
  difensori: any;
  attaccanti: any;
  giocatoriPosseduti: any;

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
    public memoryLoginService: MemoryLoginService,
    public titolariService: TitolariService,
    private modalService: NgbModal
  ) { }
  

  ngOnInit(): void {
    this.loaderService.setShow(true);
    forkJoin({
      formazioni: this.formationService.getAllFormazioni(),
      utente: this.memoryLoginService.getUtenteAggiornato(),
      giocatori: this.formationService.getGiocatoriPosseduti(this.memoryLoginService.getUtente().id_utente)
    }).subscribe(
      (res) => { 
        if(res) {
          this.userFormation = res.utente.squadra?.id_formazione;
          this.formazioni = res.formazioni;

          this.giocatoriPosseduti = res.giocatori;

          if (this.userFormation != null) {
            this.formazioni.forEach((form: any) => {
              if (form.id_formazione === this.userFormation) {
                this.formazioneSelected = form;
                this.onChangeFormation();
              }
            })
          }
          
        }
      },
      (err: Error) => { 
          this.loaderService.setShow(false) 
      },
      () => { }
    )
  }

  onChangeFormation() {
    this.loaderService.setShow(true);
    let utente = this.memoryLoginService.getUtente()
    if (this.formazioneSelected) {
      this.formationService.aggiornaFormazione(this.formazioneSelected, utente).subscribe(
        (res: any) => { 
          this.loaderService.setShow(false);
          if(res) {
            this.formazione_titolare = res;
            this.attaccanti = this.formazione_titolare.attaccanti;
            this.difensori = this.formazione_titolare.difensori;
            this.portieri = this.formazione_titolare.portieri;
            this.richiamaFormazioneTitolare(utente.id_utente);
          }
        },
        (err: Error) => { 
          this.loaderService.setShow(false) ;
        },
        () => {  }
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
          () => {
            this.loaderService.setShow(false)
            this.salvaGiocatoreTitolare(this.giocatoreSelected, this.memoryLoginService.getUtente());
          },
          () => { },
        );
      },
      (err: Error) => { 
        this.loaderService.setShow(false) ;
      },
      () => {  }
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

  salvaGiocatoreTitolare(giocatoreSelected: any, utente: any) {
    this.loaderService.setShow(true);
    this.titolariService.aggiornaTitolari(giocatoreSelected, utente).subscribe(
      () => { 
        this.loaderService.setShow(false)
        this.richiamaFormazioneTitolare(utente.id_utente);
      },
      (err: Error) => { this.loaderService.setShow(false) ;
      },
      () => {  }
    )
  }

  richiamaFormazioneTitolare(id: number) {
    this.loaderService.setShow(true);
    this.titolariService.getTitolari(id).subscribe(
      (res: any) => { 
        this.loaderService.setShow(false)
        this.formazione_titolare = res;
        this.attaccanti = this.formazione_titolare.attaccanti;
        this.difensori = this.formazione_titolare.difensori;
        this.portieri = this.formazione_titolare.portieri;
      },
      (err: Error) => { this.loaderService.setShow(false) ;
      },
      () => {  }
    )
  }
  
}

