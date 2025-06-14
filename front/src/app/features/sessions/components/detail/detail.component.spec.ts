import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder } from '@angular/forms';


describe('DetailComponent', () => {
  let component: DetailComponent; // Composant à tester
  let fixture: ComponentFixture<DetailComponent>; 
  
  let sessionApiServiceMock: Partial<SessionApiService>; // Mock du service API de session
  let matSnackBarMock: Partial<MatSnackBar>; // Mock de MatSnackBar
  let routerMock: Partial<Router>; // Mock du Router
  let mockSessionService: Partial<SessionService>;

  /**
   * Configuration avant chaque test
   */
  beforeEach(async () => {
    // Mock du service de session qui simule les infos de l’utilisateur connecté
    // Ce service est utilisé dans le composant pour savoir si l'utilisateur est admin,
    mockSessionService = {
      sessionInformation: {
        id: 1,
        admin: true,
        token: 'fake-token',
        type: 'Bearer',
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe'
      }
    };
  
    sessionApiServiceMock = {
      //simule la suppression d’une session
      delete: jest.fn().mockReturnValue(of({})), 
      //simule la récupération d’une session existante
      detail: jest.fn().mockReturnValue(of({ 
        id: 123,
        name: 'Formation Angular',
        description: 'Session sur les bases du framework Angular',
        date: new Date('2025-06-11'),
        teacher_id: 7,
        users: [1, 2, 3],
        createdAt: new Date('2025-06-01T09:00:00'),
        updatedAt: new Date('2025-06-10T10:00:00')
      }))
    };
  
    // On remplace la fonction du navigateur window.history.back
    window.history.back = jest.fn();
  
    // Mock de MatSnackBar 
    matSnackBarMock = { open: jest.fn() };
  
    // Mock du Router pour intercepter les redirections
    routerMock = { navigate: jest.fn() };
  
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,    
        MatSnackBarModule,   
        MatCardModule,      
        MatIconModule       
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('123') // simule un ID dans l’URL
              }
            }
          }
        },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },          
        { provide: SessionService, useValue: mockSessionService }, 
        FormBuilder
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  
    fixture.detectChanges();
  });
  

  /**
   * Vérifie que le composant est bien instancié
   */
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit être créé
  });

  /**
   * Vérifie que la méthode back() appelle bien window.history.back()
   */
  it('should call the method "back" to return previous page', () => {
    component.back(); // Appelle la méthode back
    expect(window.history.back).toHaveBeenCalled(); // Vérifie qu'elle a été invoquée
  });

  /**
   * Vérifie que la méthode delete() appelle sessionApiService.delete,
   * affiche une snackbar, puis redirige vers la page des sessions
   */
  it('should call sessionApiService.delete and navigate after successful deletion', () => {
    component.delete(); // Appelle la méthode delete

    // Vérifie que la suppression a été tentée avec l’ID "123"
    expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('123');

    // Vérifie que la snackbar a bien été affichée
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });

    // Vérifie que l’utilisateur a été redirigé vers la liste des sessions
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });

});
