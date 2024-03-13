import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KanbanRoutingModule } from './kanban-routing.module';

@NgModule({
  declarations: [DashboardComponent, HeaderComponent],
  imports: [CommonModule, KanbanRoutingModule],
})
export class KanbanModule {}
