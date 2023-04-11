import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './core/models/role';
import { LoginComponent } from './login/login.component';



const appRoutes: Routes = [
  {
    path: 'login',
    data: { roles: ['login'] },
    component: LoginComponent
  },
  {
    path: 'dashboard',
    data: { roles: [Role.ROOT] },
    loadChildren: () =>
      import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
