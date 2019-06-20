import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'switches', loadChildren: './pages/switches/switches.module#SwitchesModule' },
  { path: 'temperature', loadChildren: './pages/temperature/temperature.module#TemperatureModule' },
  { path: 'options/:idx', loadChildren: './pages/device-options/device-options.module#DeviceOptionsModule' },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
