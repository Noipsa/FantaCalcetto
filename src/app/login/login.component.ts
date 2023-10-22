import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoaderService } from '../home/loader/loader.service';
import { UtenteLogin } from './model/utenteLogin';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { MemoryLoginService } from '../home/service/memory-login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  profileForm: FormGroup;
  hiddenError: boolean = false;
  hiddenSuccess: boolean = false;
  errorMessage: string = "";
  
  constructor (
    public loaderService: LoaderService,
    public loginService: LoginService,
    private router: Router,
    public memoryLoginService: MemoryLoginService
  ) {
    this.profileForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }
  ngOnInit(): void {
    this.memoryLoginService.svuotaUtente();
  }

  login() {
    this.profileForm.get('email')?.setValue(this.profileForm.get('email')?.value.trim());
    this.profileForm.get('password')?.setValue(this.profileForm.get('password')?.value.trim());
    if (this.profileForm.valid) {
      this.memoryLoginService.adminEvent.emit(false);
      this.loaderService.setShow(true);
      let utente = new UtenteLogin();
      utente.email = this.profileForm.get('email')?.value;
      utente.password = this.profileForm.get('password')?.value;
      this.loginService.login(utente)
      .subscribe(
        (res: any) => { 
          this.memoryLoginService.setUtente(res);
          this.hiddenSuccess = true;
          setTimeout( () => { this.hiddenSuccess = false }, 1500 );
          this.loaderService.setShow(false);
          localStorage.setItem('id', res.utente.id_utente);
          localStorage.setItem('email', utente.email!);
          localStorage.setItem('password', utente.password!);

          localStorage.setItem('mercato', res.mercato);

          let admin = false;
          if(this.isAdmin(utente)) {
            admin = true;
            this.router.navigate(['admin']);
            this.memoryLoginService.adminLogin();
          }

          if(!admin){
            this.router.navigate(['matchs']);
          }
        },
        (err: Error) => { 
          this.hiddenError = true;
          this.errorMessage = "Utente non registrato o Non abilitato";

          this.profileForm.get('email')?.setValue("");
          this.profileForm.get('password')?.setValue("");

          setTimeout( () => { this.hiddenError = false }, 1500 );
          this.loaderService.setShow(false) 
        },
        () => { this.loaderService.setShow(false) })
    } else {
      this.errorMessage = "Compilare i campi";
      this.hiddenError = true;
      setTimeout( () => { this.hiddenError = false }, 1500 );
    }
  }

  isAdmin(utente: any) {
    return utente.email !== null && utente.email.toLowerCase() === 's' && utente.password !== null && utente.password.toLowerCase() === 's';
  }
}
