import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Events } from 'src/app/models/enums/Events';
import { CreateCardRequest } from 'src/app/models/interface/card/request/createCardRequest';
import { GetAllCardsResponse } from 'src/app/models/interface/card/response/GetAllCardsResponse';
import { CreateColumnRequest } from 'src/app/models/interface/column/request/createColumnRequest';
import { EditColumnRequest } from 'src/app/models/interface/column/request/editColumnRequest';
import { GetAllColumnsResponse } from 'src/app/models/interface/column/response/GetAllColumnsResponse';
import { UserResponse } from 'src/app/models/interface/user/user/response/UserResponse';
import { CardService } from 'src/app/service/card/card.service';
import { UserService } from 'src/app/service/user/user.service';
import { EventAction } from './../../../../models/interface/EventAction';
import { ColumnService } from './../../../../service/column/column.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public userDatas: Array<UserResponse> = [];
  public card!: GetAllCardsResponse;
  public isError: boolean = false;
  public textError!: string;
  public isLoading: boolean = false;
  public dialogAction!: {
    event: EventAction;
    data: GetAllCardsResponse[] | GetAllColumnsResponse[];
  };
  public selectedUser: Array<{ name: string; id: string }> = [];
  public selectedColumn: Array<{ title: string; id: string }> = [];

  public addColumnEvent = Events.ADD_COLUMN_EVENT;
  public editColumnEvent = Events.EDIT_COLUMN_EVENT;
  public addCardEvent = Events.ADD_CARD_EVENT;
  public editCardEvent = Events.EDIT_CARD_EVENT;
  public alterColumnToCard = Events.EDIT_COLUMN_TO_CARD;

  public columnForm = this.formBuilder.group({
    title: ['', Validators.required],
  });

  public editCardForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    responsable: ['', Validators.required],
  });

  public addCardForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    responsable: ['', Validators.required],
  });

  public alterColumnToCardForm = this.formBuilder.group({
    column: ['', Validators.required],
  });

  public columnTitle?: string;
  public cardTitle?: string;
  public userResponsable?: { name: string; id: string };

  constructor(
    private ref: DynamicDialogConfig,
    private modalRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private columnService: ColumnService,
    private userService: UserService,
    private cardService: CardService
  ) {}

  getAllUserDatas() {
    if (
      this.dialogAction.event.action === this.addCardEvent ||
      this.dialogAction.event.action === this.editCardEvent
    ) {
      this.userService
        .getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.length > 0) {
              this.userDatas = response;
            }
          },
          error(err) {
            console.log('error');
          },
        });
    }
  }

  ngOnInit(): void {
    this.dialogAction = this.ref.data;
    this.getAllUserDatas();

    this.columnTitle = this.dialogAction?.data?.find(
      (item) => item.id === this.dialogAction.event.id
    )?.title;

    this.card = this.dialogAction?.data?.find(
      (item) => item.id === this.dialogAction.event.id
    ) as GetAllCardsResponse;

    if (this.card) {
      this.userResponsable = this.card.user;
    }

    if (this.userResponsable) {
      this.editCardForm.patchValue({
        title: this.card.title,
        description: this.card.description,
        responsable: this.userResponsable.id,
      });
    }
  }

  closeModal(dataType: string | null): void {
    if (this.ref) {
      this.modalRef.close({ changed: true, dataType: dataType });
    }
  }

  handleSubmitAddColumn(): void {
    if (this.columnForm.value && this.columnForm.valid) {
      this.isLoading = true;

      const requestCreateColumn: CreateColumnRequest = {
        title: this.columnForm.value.title as string,
      };

      this.columnService
        .createColumn(requestCreateColumn)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isError = false;
            this.isLoading = false;
            if (this.ref) {
              this.closeModal('columns');
            }
          },

          error: (_) => {
            this.textError = 'Desculpe, tente novamente !';
            this.isError = true;
            this.isLoading = false;
          },
        });
    }
  }

  handleSubmitEditColumn(): void {
    if (
      this.columnForm.value &&
      this.columnForm.valid &&
      this.columnTitle !== this.columnForm.value.title
    ) {
      const requestEditColumn: EditColumnRequest = {
        id: this.dialogAction.event.id as string,
        title: this.columnForm.value.title as string,
      };

      this.columnService
        .editColumn(requestEditColumn)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isError = false;
            this.isLoading = false;
            if (this.ref) {
              this.closeModal('columns');
            }
          },
          error: (err) => {
            this.textError = 'Desculpe, tente novamente !';
            this.isError = true;
            this.isLoading = false;
          },
        });
    }
  }

  handleSubmitEditCard(): void {
    if (this.editCardForm.value && this.editCardForm.valid) {
      const requestEditCard = {
        id: this.dialogAction.event.id as string,
        title: this.editCardForm.value.title as string,
        description: this.editCardForm.value.description as string,
      };

      if (
        requestEditCard.title !== this.card.title ||
        requestEditCard.description !== this.card.description
      ) {
        this.cardService
          .editCard(requestEditCard)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isError = false;
              this.isLoading = false;
              if (this.ref) {
                this.closeModal('cards');
              }
            },
            error: (err) => {
              this.textError = 'Desculpe, tente novamente !';
              this.isError = true;
              this.isLoading = false;
            },
          });
      }

      const responsableEdit = {
        id: this.dialogAction.event.id as string,
        user: this.editCardForm.value.responsable as string,
      };

      if (responsableEdit.user !== this.card.user.id) {
        this.cardService
          .editUserToCard(responsableEdit)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isError = false;
              this.isLoading = false;
              if (this.ref) {
                this.closeModal('cards');
              }
            },
            error: (err) => {
              console.log(err);
              this.textError = 'Desculpe, tente novamente !';
              this.isError = true;
              this.isLoading = false;
            },
          });
      }
    }
  }

  handleSubmitAddCard(): void {
    if (this.addCardForm.value && this.addCardForm.valid) {
      this.isLoading = true;

      const requestCreateCard: CreateCardRequest = {
        title: this.addCardForm.value.title as string,
        description: this.addCardForm.value.description as string,
        user: this.addCardForm.value.responsable as string,
        column: this.dialogAction.event.id as string,
      };

      this.cardService
        .createCard(requestCreateCard)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isError = false;
            this.isLoading = false;
            if (this.ref) {
              this.closeModal('cards');
            }
          },
          error: (error) => {
            console.log(error);
            this.textError = 'Desculpe, tente novamente !';
            this.isError = true;
            this.isLoading = false;
          },
        });
    }
  }

  handleAlterColumnToCard(): void {
    if (this.alterColumnToCardForm.value && this.alterColumnToCardForm.valid) {
      const data = {
        id: this.dialogAction.event.id as string,
        column: this.alterColumnToCardForm.value.column as string,
      };

      this.cardService
        .alterColumnToCard(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isError = false;
            this.isLoading = false;
            if (this.ref) {
              this.closeModal('cards');
            }
          },
          error: (err) => {
            console.log(err);
            this.textError = 'Desculpe, tente novamente !';
            this.isError = true;
            this.isLoading = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
