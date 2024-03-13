import { Component, Input } from '@angular/core';
import { GetAllCardsResponse } from 'src/app/models/interface/card/GetAllCardsResponse';

@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
})
export class ColumnsComponent {
  @Input() title!: string;
  @Input() id!: string;
  @Input() cards: Array<GetAllCardsResponse> = [];
}
