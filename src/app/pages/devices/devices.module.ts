import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@nd/shared/shared.module';
import { DevicesComponent } from './devices.component';
import { routes } from './devices.routes';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [],
  declarations: [
    DevicesComponent
  ],
  providers: [],
})
export class DevicesModule { }
