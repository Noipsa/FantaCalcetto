import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
  
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatchsComponent } from './matchs/matchs.component';
import { FormationComponent } from './formation/formation.component';
import { MarketComponent } from './market/market.component';
import { MatchOfDayComponent } from './match-of-day/match-of-day.component';
import { ClassifiedComponent } from './classified/classified.component';
import { AmministrazioneComponent } from './amministrazione/amministrazione.component';
import { UserComponent } from './user/user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'matchs', component: MatchsComponent},
  { path: 'market', component: MarketComponent},
  { path: 'formation', component: FormationComponent},
  { path: 'matchofday', component: MatchOfDayComponent},
  { path: 'classified', component: ClassifiedComponent},
  { path: 'admin', component: AmministrazioneComponent},
  { path: 'user', component: UserComponent}
];


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    MatchsComponent,
    FormationComponent,
    MarketComponent,
    MatchOfDayComponent,
    ClassifiedComponent,
    AmministrazioneComponent,
    UserComponent
  ],
  providers: [],
  bootstrap: [HomeComponent]
})
export class AppModule { }
