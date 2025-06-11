import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Session } from '../../interfaces/session.interface';
  import { of } from 'rxjs';



import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  } 

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call snackbar and navigate in exitPage()', () => {
    const snackSpy = jest.spyOn(component['matSnackBar'], 'open');
    const navSpy = jest.spyOn(component['router'], 'navigate');
  
    // @ts-ignore
    component['exitPage']('Bye!');
  
    expect(snackSpy).toHaveBeenCalledWith('Bye!', 'Close', { duration: 3000 });
    expect(navSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should initialize the form with correct values and required validators', () => {
    const session = {
      name: 'Test Name',
      date: '2025-06-10T12:00:00Z',
      teacher_id: '456',
      description: 'A session'
    };
  
    // @ts-ignore
    component['initForm'](session);
  
    const form = component.sessionForm!;
    expect(form.get('name')?.value).toBe('Test Name');
    expect(form.get('date')?.value).toBe('2025-06-10');
    expect(form.get('teacher_id')?.value).toBe('456');
    expect(form.get('description')?.value).toBe('A session');
  
    expect(form.get('name')?.hasValidator(Validators.required)).toBe(true);
    expect(form.get('date')?.hasValidator(Validators.required)).toBe(true);
    expect(form.get('teacher_id')?.hasValidator(Validators.required)).toBe(true);
    expect(form.get('description')?.hasValidator(Validators.required)).toBe(true);
  });

  it('should call create() and exitPage with "Session created !" when onUpdate is false', () => {
    component['onUpdate'] = false;
  
    component.sessionForm = new FormBuilder().group({
      name: ['New Session'],
      date: ['2025-06-11'],             // reste une string car c’est un champ de formulaire
      teacher_id: [1],                  // valeur numérique ici
      description: ['Test description']
    });
  
    const mockSession: Session = {
      name: 'New Session',
      date: new Date('2025-06-11'),     // Date valide
      teacher_id: 1,                    // number au lieu de string
      description: 'Test description',
      users: []                         // liste vide OK
    };
  
    const createSpy = jest
      .spyOn(component['sessionApiService'], 'create')
      .mockReturnValue(of(mockSession)); // of() retourne Observable<Session>
  
    const exitSpy = jest.spyOn<any, any>(component, 'exitPage');
  
    component.submit();
  
    expect(createSpy).toHaveBeenCalledWith(component.sessionForm.value);
    expect(exitSpy).toHaveBeenCalledWith('Session created !');
  });





it('should call update() and exitPage with "Session updated !" when onUpdate is true', () => {
  component['onUpdate'] = true;
  component['id'] = '42'; // ou n'importe quel ID numérique

  component.sessionForm = new FormBuilder().group({
    name: ['Updated Session'],
    date: ['2025-06-12'],           // toujours string côté formulaire
    teacher_id: [2],                // number
    description: ['Updated description']
  });

  const mockSession: Session = {
    name: 'Updated Session',
    date: new Date('2025-06-12'),
    teacher_id: 2,
    description: 'Updated description',
    users: []
  };

  const updateSpy = jest
    .spyOn(component['sessionApiService'], 'update')
    .mockReturnValue(of(mockSession));

  const exitSpy = jest.spyOn<any, any>(component, 'exitPage');

  component.submit();

  expect(updateSpy).toHaveBeenCalledWith('42', component.sessionForm.value);
  expect(exitSpy).toHaveBeenCalledWith('Session updated !');
});

  
  
  
});
