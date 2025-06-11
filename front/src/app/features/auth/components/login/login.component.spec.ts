import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController; // Pour intercepter les requêtes HTTP
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn() // Mock de la méthode 'navigate'
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService, FormBuilder,
        AuthService, // Service réel pour l'intégration
        { provide: Router, useValue: routerMock }],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule, // Utiliser HttpClientTestingModule pour les tests
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Initialiser httpMock
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête non traitée n'est restée
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate to sessions on success', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.submit();

    // Intercepter la requête HTTP et simuler une réponse réussie
    const req = httpMock.expectOne('api/auth/login'); // Endpoint attendu
    expect(req.request.method).toBe('POST'); // Vérifie que c'est bien une requête POST
    req.flush({}); // Simule une réponse vide pour un succès

    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']); // Vérifie la redirection
  });

  it('should set onError to true on login error', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.submit();

    // Intercepter la requête HTTP et simuler une erreur
    const req = httpMock.expectOne('api/auth/login');
    req.flush('Login failed', { status: 400, statusText: 'Bad Request' });

    expect(component.onError).toBe(true); // Vérifie que onError est mis à true
  });
});
