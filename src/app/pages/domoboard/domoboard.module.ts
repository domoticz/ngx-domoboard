import { NgModule } from '@angular/core';

import { DomoboardComponent } from './domoboard.component';
import { DomoboardRoutingModule } from './domoboard-routing.module';

@NgModule({
  imports: [DomoboardRoutingModule],
  exports: [],
  declarations: [DomoboardComponent],
  providers: [],
})
export class DomoboardModule { }
