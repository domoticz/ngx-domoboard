import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'switches', loadChildren: './pages/switches/switches.module#SwitchesModule' },
  { path: '',   redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
