import { NgModule } from '@angular/core';

import { SharedModule } from '@nd/shared/shared.module';

import { SwitchesComponent } from './switches.component';
import { SwitchesRoutingModule } from './switches-routing.module';

@NgModule({
  imports: [
    SwitchesRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    SwitchesComponent
  ],
  providers: [],
})
export class SwitchesModule { }
