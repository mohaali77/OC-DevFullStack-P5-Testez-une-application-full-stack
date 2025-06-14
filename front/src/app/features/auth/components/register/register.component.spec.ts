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
import { RegisterComponent } from './register.component';

/**
 * Test d'intégration du RegisterComponent :
 * Intercepte les requêtes HTTP grâce à HttpTestingController
 */
describe('RegisterComponent', () => {
  let component: RegisterComponent; // Composant à tester
  let fixture: ComponentFixture<RegisterComponent>; 
  let httpMock: HttpTestingController; // Pour intercepter les requêtes HTTP
  let routerMock: Partial<Router>; // Mock du router

  /**
   * Configuration du test avant chaque test unitaire
   */
  beforeEach(async () => {
    // Mock de la méthode navigate du router
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent], // Composant testé
      providers: [
        FormBuilder, 
        AuthService,
        { provide: Router, useValue: routerMock } 
      ],
      imports: [
        HttpClientTestingModule, // Simule les requêtes HTTP
        ReactiveFormsModule, // Pour utiliser les formulaires réactifs
        MatFormFieldModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
    }).compileComponents(); // Compilation du composant et de ses dépendances

      // Initialisation du contrôleur HTTP pour intercepter les appels
      httpMock = TestBed.inject(HttpTestingController);

      fixture = TestBed.createComponent(RegisterComponent);
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
   * Vérifie que le composant est bien instancié
   */
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit exister
  });

  /**
   * Vérifie que l'inscription fonctionne et redirige vers la page de login
   */
  it('should register the user and navigate to login on success', () => {
    // Remplit tous les champs du formulaire
    component.form.setValue({
      email: 'test@test.com',
      lastName: 'Doe',
      firstName: 'John',
      password: 'password123'
    }); 

    // Soumet le formulaire
    component.submit(); 

    // Intercepte la requête
    const req = httpMock.expectOne('api/auth/register'); 
    // Vérifie que c’est bien une requête POST
    expect(req.request.method).toBe('POST'); 
    // Simule une réponse vide = succès
    req.flush({}); 

    // Vérifie la redirection vers la page login
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']); 
  });

  /**
   * Configuration avant chaque test (simule l'environnement du composant).
   */
  it('should set onError to true on registration error', () => {
    component.form.setValue({
      email: 'test@test.com',
      lastName: 'Doe',
      firstName: 'John',
      password: 'password123'
    }); // Remplit le formulaire

    // Soumet le formulaire
    component.submit(); 

    // Interception de la requête
    const req = httpMock.expectOne('api/auth/register'); 
    req.flush('Registration failed', { status: 400, statusText: 'Bad Request' }); // Simule une erreur

    // Vérifie que l’erreur est bien détectée
    expect(component.onError).toBe(true); 
  });
});
