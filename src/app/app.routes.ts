import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'devices',
    loadChildren: './pages/devices/devices.module#DevicesModule'
  },
  { path: 'temperature', loadChildren: './pages/temperature/temperature.module#TemperatureModule' },
  { path: 'options/:idx', loadChildren: './pages/device-options/device-options.module#DeviceOptionsModule' },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
