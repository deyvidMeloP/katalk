import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Certifique-se de importar Routes
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

// Defina suas rotas aqui
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use a constante routes aqui
  exports: [RouterModule]
})
export class AppRoutingModule { }
