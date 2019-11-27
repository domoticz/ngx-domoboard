import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'devices',
    loadChildren: './pages/devices/devices.module#DevicesModule'
  },
  { path: 'options/:idx', loadChildren: './pages/device-options/device-options.module#DeviceOptionsModule' },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
