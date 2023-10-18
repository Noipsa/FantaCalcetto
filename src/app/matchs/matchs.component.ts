import { Component, OnInit } from '@angular/core';
import { MatchsService } from './service/matchs.service';
import { LoaderService } from '../home/loader/loader.service';

@Component({
  selector: 'matchs',
  templateUrl: './matchs.component.html',
  styleUrls: ['./matchs.component.scss']
})
export class MatchsComponent implements OnInit{
  matchsList: any = [];

  constructor(
    public matchsService: MatchsService,
    public loaderService: LoaderService
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
    },
    () => { this.loaderService.setShow(false) })
  }

}
