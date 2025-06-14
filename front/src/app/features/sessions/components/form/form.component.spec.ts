import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../interfaces/session.interface';
import { Router } from '@angular/router';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionApiService: Partial<SessionApiService>;
  let mockSessionService: Partial<SessionService>;

  /**
   * Configuration du module de test avant chaque exécution
   */
  beforeEach(async () => {
    // Mock du service de session (utilisateur connecté)
    mockSessionService = {
      sessionInformation: {
        id: 1,
        admin: true,
        token: 'fake-token',
        type: 'Bearer',
        username: 'admin',
        firstName: 'John',
        lastName: 'Doe'
      }
    };

    // Mock du service d’API pour les sessions
    mockSessionApiService = {
      create: jest.fn(),
      update: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
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
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('42')
              }
            }
          }
        }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Vérifie que le composant est bien instancié
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
 * Vérifie que la méthode exitPage() affiche bien la snackbar
 * et redirige vers la page 'sessions'
 */
it('should call snackbar and navigate in exitPage()', () => {

  const snackSpy = jest.spyOn(component['matSnackBar'], 'open');
  const navSpy = jest.spyOn(component['router'], 'navigate');

  // Appelle la méthode exitPage() avec un message
  // @ts-ignore est utilisé car exitPage est private
  component['exitPage']('Session created !');

  // Vérifie que la snackbar a bien été affichée avec les bonnes infos
  expect(snackSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });

  // Vérifie que la navigation a bien redirigé vers la route 'sessions'
  expect(navSpy).toHaveBeenCalledWith(['sessions']);
});


  /**
 * Vérifie que le formulaire est initialisé correctement
 * avec les bonnes valeurs et les validateurs requis
 */
it('should initialize the form with correct values and required validators', () => {
  // Crée un objet Session toutes les propriétés attendues
  const mockSession: Session = {
    id: 123,
    name: 'Test Name',
    date: new Date('2025-06-10T12:00:00Z'),
    teacher_id: 456,
    description: 'A session',
    users: [1, 2, 3],
    createdAt: new Date('2025-06-01T10:00:00Z'),
    updatedAt: new Date('2025-06-09T18:30:00Z')
  };

  // Appelle la méthode privée initForm() avec la session crée en paramètre pour initialiser le formulaire
  // @ts-ignore est utilisé car initForm est private
  component['initForm'](mockSession);

  // Récupère le formulaire initialisé
  const form = component['sessionForm']!;

  // Vérifie que chaque champ du formulaire contient bien la valeur attendue
  expect(form.get('name')?.value).toBe(mockSession.name);                 
  expect(form.get('date')?.value).toBe('2025-06-10');                 
  expect(form.get('teacher_id')?.value).toBe(mockSession.teacher_id);     
  expect(form.get('description')?.value).toBe(mockSession.description);  

  // Vérifie que chaque champ est bien marqué comme "required"
  expect(form.get('name')?.hasValidator(Validators.required)).toBe(true);
  expect(form.get('date')?.hasValidator(Validators.required)).toBe(true);
  expect(form.get('teacher_id')?.hasValidator(Validators.required)).toBe(true);
  expect(form.get('description')?.hasValidator(Validators.required)).toBe(true);
});

  /**
 * Vérifie que submit() appelle bien create() si onUpdate est false,
 * et que exitPage() est ensuite appelée avec le bon message de succès.
 */
it('should call create() and exitPage with "Session created !" when onUpdate is false', () => {
  // Simule le contexte "création" en mettant onUpdate à false
  component['onUpdate'] = false;

  const exitSpy = jest.spyOn<any, any>(component, 'exitPage');

  // Crée un objet Session toutes les propriétés attendues
  const mockSession: Session = {
    name: 'New Session',
    date: new Date('2025-06-11T00:00:00Z'),
    teacher_id: 1,
    description: 'Test description',
    users: [],
    id: 101, 
    createdAt: new Date('2025-06-01T09:00:00Z'),
    updatedAt: new Date('2025-06-01T09:00:00Z')
  };

  // Appelle la méthode initForm() avec la session créée en paramètre pour initialiser le formulaire
  // @ts-ignore est utilisé car initForm est private
  component['initForm'](mockSession);

  // Prépare le faux service create() pour qu'il retourne un Observable de la session créée
  (mockSessionApiService.create as jest.Mock).mockReturnValue(of(mockSession));

  // Appelle la méthode submit() comme si l'utilisateur cliquait sur "Valider"
  component.submit();

  // Vérifie que le service create() a bien été appelé avec les valeurs actuelles du formulaire
  expect(mockSessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value);

  // @ts-ignore // Vérifie que exitPage() a été appelée avec le bon message
  expect(exitSpy).toHaveBeenCalledWith('Session created !');
});


  /**
 * Vérifie que submit() appelle bien update() si onUpdate est true,
 * et que exitPage() est ensuite appelée avec le bon message de succès.
 */
it('should call update() and exitPage with "Session updated !" when onUpdate is true', () => {
  // Simule le contexte "modification" en mettant onUpdate à true
  component['onUpdate'] = true;

  // Fournit un ID de session existante à mettre à jour
  // @ts-ignore //
  component['id'] = '42';

  const exitSpy = jest.spyOn<any, any>(component, 'exitPage');

  // Crée un objet Session toutes les propriétés attendues
  const mockSession: Session = {
    id: 42,
    name: 'Updated Session',
    date: new Date('2025-06-12'),
    teacher_id: 2,
    description: 'Updated description',
    users: [],
    createdAt: new Date('2025-06-01T09:00:00Z'),
    updatedAt: new Date('2025-06-10T15:30:00Z')
  };

  // Appelle la méthode initForm() avec la session a modifié en paramètre pour initialiser le formulaire
  // @ts-ignore car initForm est private
  component['initForm'](mockSession);

  // Prépare le faux service update() pour qu'il retourne un Observable de la session mise à jour
  (mockSessionApiService.update as jest.Mock).mockReturnValue(of(mockSession));

  // Appelle submit() comme si l'utilisateur validait la modification
  component.submit();


  // Vérifie que le service update() a bien été appelé avec l’ID et les nouvelles valeurs du formulaire
  expect(mockSessionApiService.update).toHaveBeenCalledWith('42', component.sessionForm?.value);

  // @ts-ignore // Vérifie que exitPage() a été appelée avec le bon message
  expect(exitSpy).toHaveBeenCalledWith('Session updated !');
  
});

});
