import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let sessionApiServiceMock: any;
  let teacherServiceMock: any;
  let matSnackBarMock: any;
  let routerMock: any;


  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123'), // Simuler l'ID de la session
      }
    }
  };


  beforeEach(async () => {

    window.history.back = jest.fn(); // Mock de window.history.back

    sessionApiServiceMock = {
      delete: jest.fn().mockReturnValue(of({})),
      detail: jest.fn().mockReturnValue(of({
        id: 123,
        users: [1, 2, 3] // Mock des utilisateurs de la session
      }))
    };
    matSnackBarMock = { open: jest.fn() };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: SessionApiService, useValue: sessionApiServiceMock },
      { provide: MatSnackBar, useValue: matSnackBarMock },
      { provide: Router, useValue: routerMock }
      ],
    }).compileComponents();

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the method "back" to return previous page', () => {
    component.back(); // Appeler la méthode back du composant
    expect(window.history.back).toHaveBeenCalled(); // Vérifier que la méthode back a été appelée
  });

  it('should call sessionApiService.delete and navigate after successful deletion', () => {
    component.delete();
    expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('123');
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });

});

