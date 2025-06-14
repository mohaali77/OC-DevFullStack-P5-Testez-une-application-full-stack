import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from '@jest/globals';

import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';

/**
 * Test d'intégration du LoginComponent :
 * Intercepte les requêtes HTTP grâce à HttpTestingController
 */
describe('LoginComponent', () => {
  let component: LoginComponent; //Composant à tester
  let fixture: ComponentFixture<LoginComponent>; 
  let httpMock: HttpTestingController; // Pour intercepter et simuler les appels HTTP
  let routerMock: Partial<Router>;  

  /**
   * Configuration avant chaque test (simule l'environnement du composant).
   */
  beforeEach(async () => {
    // Mock de la méthode navigate du router
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        AuthService, 
        { provide: Router, useValue: routerMock },

      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule, //Fournit un faux backend pour tester les requêtes
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
    }).compileComponents();

      // Initialisation du contrôleur HTTP pour intercepter les appels
      httpMock = TestBed.inject(HttpTestingController);

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  /**
   * Vérifie qu’aucune requête HTTP n’est restée non traitée à la fin de chaque test
   */
  afterEach(() => {
    httpMock.verify(); 
  });

  /**
   * Vérifie que le composant a bien été instancié
   */
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit exister
  });

  /**
   * Vérifie que si le login réussit, on appelle router.navigate(['/sessions'])
   */
  it('should call authService.login and navigate to sessions on success', () => {
    // On remplit le formulaire avec des valeurs valides
    component.form.setValue({
      email: 'test@test.com',
      password: 'password123'
    });

    // On soumet le formulaire
    component.submit();

    // Intercepte la requête POST attendue
    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST'); // Vérifie qu’il s’agit bien d’un POST

    // Simule une réponse vide pour signifier un succès
    req.flush({});

    // Vérifie qu’on a bien été redirigé vers /sessions
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  /**
   * Vérifie que si le login échoue, on affiche une erreur (onError = true)
   */
  it('should set onError to true on login error', () => {
    // On remplit le formulaire avec des valeurs
    component.form.setValue({
      email: 'test@test.com',
      password: 'password123'
    });

    // On soumet le formulaire
    component.submit();

    // Intercepte la requête POST
    const req = httpMock.expectOne('api/auth/login');

    // Simule une réponse en erreur
    req.flush('Login failed', {
      status: 400,
      statusText: 'Bad Request'
    });

    // Vérifie que l’erreur est bien détectée
    expect(component.onError).toBe(true);
  });
});
