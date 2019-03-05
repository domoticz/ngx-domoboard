import { NgModule } from '@angular/core';

import { SharedModule } from '@nd/shared/shared.module';

import { LightsComponent } from './lights.component';
import { LightsRoutingModule } from './lights-routing.module';

@NgModule({
  imports: [
    LightsRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    LightsComponent
  ],
  providers: [],
})
export class LightsModule { }
