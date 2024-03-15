import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'src/app/models/enums/Events';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() responsable!: string;
  @Output() editCardEvent = new EventEmitter();
  @Output() deleteCardEvent = new EventEmitter();
  @Output() alterColumnToCardEvent = new EventEmitter();

  public cardEventEdit = Events.EDIT_CARD_EVENT;
  public cardAlterColumnEdit = Events.EDIT_COLUMN_TO_CARD;

  handleEditCardEvent(action: string, id: string): void {
    if (action !== '' && id !== '') {
      this.editCardEvent.emit({ action, id });
    }
  }

  handleCardDeleteEvent(title: string, id: string): void {
    if (title !== '' && id !== '') {
      this.deleteCardEvent.emit({ title, id });
    }
  }

  handleAlterColumnToCardEvent(action: string, id: string): void {
    if (action !== '' && id !== '') {
      this.alterColumnToCardEvent.emit({ action, id });
    }
  }
}
