import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../home/loader/loader.service';
import { FormationService } from '../formation/service/formation.service';

@Component({
  selector: 'classified',
  templateUrl: './classified.component.html',
  styleUrls: ['./classified.component.scss']
})
export class ClassifiedComponent implements OnInit{
  squadre: any;

  constructor(
    public loaderService: LoaderService,
    public formationService: FormationService,
  ) {

  }

  ngOnInit(): void {
    this.loaderService.setShow(true);
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
