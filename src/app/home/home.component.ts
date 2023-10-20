import { Component, HostListener, OnInit } from '@angular/core';
import { LoaderService } from './loader/loader.service';
import { MemoryLoginService } from './service/memory-login.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtenteLogin } from '../login/model/utenteLogin';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  showLoader: boolean = false;
  showMenu: boolean = false;
  subscription: Subscription;
  browserRefresh = false;

  constructor(
    public loaderService: LoaderService,
    public memoryLoginService: MemoryLoginService,
    private router: Router,
    private loginService : LoginService
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
      }
      if(this.browserRefresh){
        let utente = new UtenteLogin();
        utente.email = localStorage.getItem('email') ? localStorage.getItem('email') : "";
        utente.password = localStorage.getItem('password');;
        this.loginService.login(utente)
        .subscribe(
          (res) => { 
            this.memoryLoginService.setUtente(res);
            //this.hiddenSuccess = true;
            //setTimeout( () => { this.hiddenSuccess = false }, 1500 );
            this.loaderService.setShow(false);
            localStorage.setItem('email', utente.email!);
            localStorage.setItem('password', utente.password!);
            this.router.navigate(['matchs']);
          },
          (err: Error) => { 
           /* this.hiddenError = true;
            this.errorMessage = "Utente non registrato o Non abilitato";
  
            this.profileForm.get('email')?.setValue("");
            this.profileForm.get('password')?.setValue("");
  
            setTimeout( () => { this.hiddenError = false }, 1500 );
            this.loaderService.setShow(false) */
          },
          () => { this.loaderService.setShow(false) })
        
      }
  });
  }


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
  }


}
