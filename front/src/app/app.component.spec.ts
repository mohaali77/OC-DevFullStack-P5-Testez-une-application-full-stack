import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs'; // Pour simuler les observables
import { Router } from '@angular/router';
import { SessionService } from './services/session.service'; // Mock du service de session
import { AuthService } from './features/auth/services/auth.service'; // Mock du service d'authentification
import { AppComponent } from './app.component';
import { expect } from '@jest/globals';

describe('AppComponent', () => {
  let sessionServiceMock: any; // Mock de SessionService
  let routerMock: any; // Mock de Router

  beforeEach(async () => {
    // Création des mocks
    sessionServiceMock = {
      $isLogged: jest.fn(), // Mock de la méthode $isLogged
      logOut: jest.fn() // Mock de la méthode logOut
    };

    routerMock = {
      navigate: jest.fn() // Mock de la méthode navigate
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock }, // Utilisation du mock pour SessionService
        { provide: Router, useValue: routerMock }, // Utilisation du mock pour Router
        AuthService // On garde AuthService car on ne le teste pas ici
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*it('should call sessionService.$isLogged to check if user is logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Simuler que l'utilisateur est connecté
    sessionServiceMock.$isLogged.mockReturnValue(of(true));

    // S'assurer que $isLogged retourne bien l'observable
    app.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true); // Vérifie que l'utilisateur est connecté
    });

    // Vérifie que la méthode $isLogged a bien été appelée
    expect(sessionServiceMock.$isLogged).toHaveBeenCalled();
  });

  it('should call sessionService.logOut and navigate to home on logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Appeler la méthode logout
    app.logout();

    // Vérifie que sessionService.logOut a été appelée
    expect(sessionServiceMock.logOut).toHaveBeenCalled();

    // Vérifie que la redirection vers la page d'accueil a été faite
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });*/
});
