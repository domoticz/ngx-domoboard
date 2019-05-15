import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'lights', loadChildren: './pages/lights/lights.module#LightsModule' },
  { path: '',   redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
