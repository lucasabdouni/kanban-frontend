import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetAllCardsResponse } from 'src/app/models/interface/card/GetAllCardsResponse';
import { GetAllColumnsResponse } from 'src/app/models/interface/column/GetAllColumnsResponse';
import { CardService } from './../../../service/card/card.service';
import { ColumnService } from './../../../service/column/column.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public columnsDatas: Array<GetAllColumnsResponse> = [];
  public cardsDatas: Array<GetAllCardsResponse> = [];

  constructor(
    private columnService: ColumnService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.getAllColumnsDatas();
    this.getAllCardsDatas();
  }

  getAllColumnsDatas() {
    this.columnService
      .getAllColumns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.columnsDatas = response;
          }
        },
        error(err) {
          console.log('error');
        },
      });
  }

  getAllCardsDatas() {
    this.cardService
      .getAllCards()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.cardsDatas = response;
          }
        },
        error(err) {
          console.log('error');
        },
      });
  }

  getCardsByColumn(columnId: string): GetAllCardsResponse[] {
    return this.cardsDatas.filter((card) => card.columnsTable.id === columnId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
