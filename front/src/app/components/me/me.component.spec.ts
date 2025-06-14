import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs'; 

import { MeComponent } from './me.component'; 
import { UserService } from 'src/app/services/user.service'; 
import { Router } from '@angular/router'; 

/**
 * Suite de tests pour le composant MeComponent.
 */
describe('MeComponent', () => {
  let component: MeComponent; // Composant à tester
  let fixture: ComponentFixture<MeComponent>; 
  let mockSessionService: Partial<SessionService>;
  let mockUserService: Partial<UserService>;
  let mockSnackBar: Partial<MatSnackBar>;
  let mockRouter: Partial<Router>;  

  /**
   * Configuration avant chaque test (simule l'environnement du composant).
   */
  beforeEach(async () => {

    // Mock de la méthode du navigateur "window.history.back"
    window.history.back = jest.fn();

    // Mock de MatSnackBar 
    mockSnackBar = {
      open: jest.fn()
    };

    // Mock de la méthode "navigate" du router
    mockRouter = {
      navigate: jest.fn()
    };

    // Mock du service de session qui simule les infos de l’utilisateur connecté
    mockSessionService = {
      sessionInformation: {
        id: 1,
        admin: true,
        token: 'token',
        type: 'Bearer',
        username: 'Test1',
        firstName: 'Test',
        lastName: 'Test'
      },
      logOut: jest.fn()
    };

    // Mock du UserService avec delete() et getById() qui retournent des observables
    mockUserService = {
      delete: jest.fn().mockReturnValue(of({})),
      getById: jest.fn().mockReturnValue(of({ id: 1, name: 'Test Test', admin: true }))
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent], 
      imports: [
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents(); 

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  /**
   * Vérifie que le composant est correctement créé.
   */
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit exister
  });

  /**
   * Vérifie que la méthode "back()" appelle window.history.back.
   */
  it('should call the method "back" to return previous page', () => {
    component.back();
    expect(window.history.back).toHaveBeenCalled(); 
  });

  /**
   * Vérifie que la méthode delete() supprime l'utilisateur, affiche une snackbar,
   * déconnecte l'utilisateur et redirige vers la page d'accueil.
   */
  it('should delete the user account', () => {
    component.delete(); // Appel de la méthode delete()

    // Vérifie que delete a été appelé avec l’ID de session converti en string
    expect(mockUserService.delete).toHaveBeenCalledWith(mockSessionService.sessionInformation?.id.toString());

    // Vérifie que la snackbar affiche un message de confirmation
    expect(mockSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });

    // Vérifie que la méthode logOut a bien été appelée
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // Vérifie que l'utilisateur a été redirigé vers "/"
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  /**
   * Vérifie que les informations de l’utilisateur sont bien récupérées au chargement.
   */
  it('should get user informations', () => {
    component.ngOnInit(); // Simule le hook d'initialisation

    // Vérifie que la méthode getById a été appelée avec l’ID utilisateur converti
    expect(mockUserService.getById).toHaveBeenCalledWith(mockSessionService.sessionInformation?.id.toString());

    // Vérifie que les données utilisateur sont bien assignées dans le composant
    expect(component.user).toEqual({ id: 1, name: 'Test Test', admin: true });
  });
});
