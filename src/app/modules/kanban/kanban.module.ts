import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KanbanRoutingModule } from './kanban-routing.module';
import { ColumnsComponent } from './components/columns/columns.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [DashboardComponent, HeaderComponent, ColumnsComponent, CardComponent],
  imports: [CommonModule, KanbanRoutingModule],
})
export class KanbanModule {}
