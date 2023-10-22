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
  
  alreadyReload: boolean = false;

  adminMenu: boolean = false;

  constructor(
    public loaderService: LoaderService,
    public memoryLoginService: MemoryLoginService,
    private router: Router,
    private loginService : LoginService
  ) {

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
        this.alreadyReload = true;
      }
      if(this.browserRefresh && this.alreadyReload){
        this.alreadyReload = false;
        let utente = new UtenteLogin();
        utente.email = localStorage.getItem('email') ? localStorage.getItem('email') : "";
        utente.password = localStorage.getItem('password');;
        this.adminMenu = this.isAdmin(utente);
        this.loginService.login(utente)
        .subscribe(
          (res) => {
            this.memoryLoginService.setUtente(res);
            //this.hiddenSuccess = true;
            //setTimeout( () => { this.hiddenSuccess = false }, 1500 );
            this.loaderService.setShow(false);
            localStorage.setItem('email', utente.email!);
            localStorage.setItem('password', utente.password!);

            if (this.router.url !== '/matchs' && this.router.url !== '/admin' && !this.isAdmin(utente)) {
              this.router.navigate(['matchs']);
            }
          },
          (err: Error) => {
            this.loaderService.setShow(false)
            if (this.router.url !== '/login') {
              this.router.navigate(['login']);
            }
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

  isAdmin(utente: any) {
    return utente.email !== null && utente.email.toLowerCase() === 's' && utente.password !== null && utente.password.toLowerCase() === 's';
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

    this.memoryLoginService.adminEvent.subscribe(
      (show: boolean) => {
        this.adminMenu = show;
      }
    )
  }


}
