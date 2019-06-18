import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'switches', loadChildren: './pages/switches/switches.module#SwitchesModule' },
  { path: 'temperature', loadChildren: './pages/temperature/temperature.module#TemperatureModule' },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
