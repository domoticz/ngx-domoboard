import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@nd/shared/shared.module';

import { DeviceOptionsComponent } from './device-options.component';
import { routes } from './device-options.routes';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [],
  declarations: [DeviceOptionsComponent],
  providers: [],
})
export class DeviceOptionsModule { }
