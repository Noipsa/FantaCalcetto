import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';   
import { Utente } from './model/utente'
import { RegisterService } from './service/register.service';
import { LoaderService } from '../home/loader/loader.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  profileForm: FormGroup;
  hiddenError: boolean = false;
  hiddenSuccess: boolean = false;
  errorMessage: string = "";
  
  constructor (
    public registerService: RegisterService,
    public loaderService: LoaderService
  ) {
    this.profileForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      nome_squadra: new FormControl('')
    });
  }

  registrazione() {
    this.profileForm.get('email')?.setValue(this.profileForm.get('email')?.value.trim());
    this.profileForm.get('password')?.setValue(this.profileForm.get('password')?.value.trim());
    this.profileForm.get('nome_squadra')?.setValue(this.profileForm.get('nome_squadra')?.value.trim());
    if (this.profileForm.valid) {
      this.loaderService.setShow(true);
      let utente = new Utente();
      utente.email = this.profileForm.get('email')?.value;
      utente.password = this.profileForm.get('password')?.value;
      utente.nome_squadra = this.profileForm.get('nome_squadra')?.value;
      this.registerService.saveUser(utente)
      .subscribe(
        () => { 
          this.loaderService.setShow(false);
          this.hiddenSuccess = true;
          setTimeout( () => { this.hiddenSuccess = false }, 1500 );
        },
        (err: Error) => { 
          this.hiddenError = true;
          this.errorMessage = err.message;

          this.profileForm.get('email')?.setValue("");
          this.profileForm.get('password')?.setValue("");
          this.profileForm.get('nome_squadra')?.setValue("");

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
}
