import { Routes } from '@angular/router';
import { LoginPage } from './login';
import { FormPage } from './form';
import { formGuard } from './form.guard';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'form', component: FormPage, canActivate: [formGuard] }
];