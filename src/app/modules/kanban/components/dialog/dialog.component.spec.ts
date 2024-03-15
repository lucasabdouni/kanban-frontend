import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { CardsResponse } from 'src/app/models/interface/card/response/CardsResponse';
import { CardService } from 'src/app/service/card/card.service';
import { ColumnService } from 'src/app/service/column/column.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let columnServiceSpy: jasmine.SpyObj<ColumnService>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;

  beforeEach(async () => {
    const cardServiceSpyObj = jasmine.createSpyObj('CardService', [
      'createCard',
      'editCard',
      'editUserToCard',
      'editColumnToCard',
    ]);

    const userServiceSpyObj = jasmine.createSpyObj('UserService', [
      'getAllUsers',
    ]);

    const columnServiceSpyObj = jasmine.createSpyObj('ColumnService', [
      'createColumn',
      'editColumn',
    ]);

    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      providers: [
        FormBuilder,
        { provide: CardService, useValue: cardServiceSpyObj },
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: ColumnService, useValue: columnServiceSpyObj },
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        // Fornecer um objeto vazio para DynamicDialogConfig
        { provide: DynamicDialogConfig, useValue: {} },
      ],
    }).compileComponents();

    cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    columnServiceSpy = TestBed.inject(
      ColumnService
    ) as jasmine.SpyObj<ColumnService>;

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createCard method when handleSubmitAddCard is called', () => {
    const mockRequest = {
      title: 'Test Title',
      description: 'Test Description',
      user: 'user_id',
      column: 'column_id',
      responsable: null,
    };

    const mockResponse: CardsResponse = {
      id: '123',
      title: mockRequest.title,
      description: mockRequest.description,
      columnsTable: {
        id: '1',
      },
      user: {
        id: mockRequest.user,
        name: 'User Name',
      },
    };

    cardServiceSpy.createCard.and.returnValue(of(mockResponse));

    component.addCardForm.setValue(mockRequest);
    component.handleSubmitAddCard();

    expect(cardServiceSpy.createCard).toHaveBeenCalledWith(mockRequest);
  });
});
