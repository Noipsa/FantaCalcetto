import { Component, HostListener, OnInit } from '@angular/core';
import { LoaderService } from './loader/loader.service';
import { MemoryLoginService } from './service/memory-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  showLoader: boolean = false;
  showMenu: boolean = false;

  constructor(
    public loaderService: LoaderService,
    public memoryLoginService: MemoryLoginService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.memoryLoginService.userChange.subscribe(
      (show: boolean) => {
        this.showMenu = show;
      }
    )

    this.loaderService.loaderChange.subscribe(
      (show: boolean) => {
        this.showLoader = show;
      }
    );

    this.router.navigate(['/login']);
  }
}
