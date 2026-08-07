import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { publicGuard } from '../guards/public.guard';


const routes: Routes = [
    {path:'register', component:RegisterComponent, canActivate:[publicGuard]},
    {path:'login',component:LoginComponent, canActivate:[publicGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }