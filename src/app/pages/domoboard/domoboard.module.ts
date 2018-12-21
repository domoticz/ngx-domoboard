import { NgModule } from '@angular/core';

import { DomoboardComponent } from './domoboard.component';
import { DomoboardRoutingModule } from './domoboard-routing.module';
import { StatusCardComponent } from './status-card/status-card.component';
import { NbCardModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    DomoboardRoutingModule,
    NbCardModule
  ],
  exports: [],
  declarations: [
    DomoboardComponent,
    StatusCardComponent
  ],
  providers: [],
})
export class DomoboardModule { }
