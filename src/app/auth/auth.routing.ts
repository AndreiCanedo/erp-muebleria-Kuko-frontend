import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { publicGuard } from '../guards/public.guard';


const routes: Routes = [
    {path:'login',component:LoginComponent, canActivate:[publicGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }