import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './temperature.routes';
import { TemperatureComponent } from './temperature.component';

import { SharedModule } from '@nd/shared/shared.module';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [],
  declarations: [TemperatureComponent],
})
export class TemperatureModule { }
