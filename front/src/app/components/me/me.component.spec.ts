import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component'; 
import { UserService } from 'src/app/services/user.service'; 
import { Router } from '@angular/router'; 

/**
 * Suite de tests d'intégration pour le composant MeComponent.
 */
describe('MeComponent', () => {
  let component: MeComponent; // Composant à tester
  let fixture: ComponentFixture<MeComponent>; 
  let mockUserService: Partial<UserService>;
  let mockSnackBar: Partial<MatSnackBar>;
  let mockRouter: Partial<Router>;  
  let httpMock: HttpTestingController;

  /**
   * Configuration avant chaque test (simule l'environnement du composant).
   */
  beforeEach(async () => {

    // Mock de MatSnackBar 
    mockSnackBar = {
      open: jest.fn()
    };

    // Mock de la méthode "navigate" du router
    mockRouter = {
      navigate: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [MeComponent], 
      imports: [
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        HttpClientTestingModule, //Fournit un faux backend pour tester les requêtes
      ],
      providers: [
        SessionService,
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
],
    }).compileComponents(); 

    // Initialisation du contrôleur HTTP pour intercepter les appels
    httpMock = TestBed.inject(HttpTestingController);

    const sessionService = TestBed.inject(SessionService);

    sessionService.sessionInformation = {
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    }; 

    fixture = TestBed.createComponent(MeComponent);
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
   * Vérifie que le composant est correctement créé.
   */
  it('should create', () => {
    // Intercepte la requête GET attendue
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET'); 
    req.flush({
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    });

    expect(component).toBeTruthy(); // Le composant doit exister
  });

  /**
   * Vérifie que la méthode "back()" appelle window.history.back.
   */
  it('should call the method "back" to return previous page', () => {

    // Mock de la méthode du navigateur "window.history.back"
    window.history.back = jest.fn();

    // Intercepte la requête GET attendue
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET'); 
    req.flush({
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    });

    component.back();
    expect(window.history.back).toHaveBeenCalled(); 
  });

  /**
   * Vérifie que la méthode delete() supprime l'utilisateur, affiche une snackbar,
   * déconnecte l'utilisateur et redirige vers la page d'accueil.
   */
  it('should delete the user account', () => {

    const sessionService = TestBed.inject(SessionService);
    jest.spyOn(sessionService, 'logOut');

    // Intercepte la requête GET attendue
    const reqGet = httpMock.expectOne('api/user/1');
    expect(reqGet.request.method).toBe('GET'); 
    reqGet.flush({
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    });

    component.delete(); // Appel de la méthode delete()

    // Intercepte la requête DELETE attendue
    const reqDelete = httpMock.expectOne('api/user/1');
    expect(reqDelete.request.method).toBe('DELETE'); // Vérifie qu’il s’agit bien d’une suppression
    reqDelete.flush({});

    // Vérifie que la snackbar affiche un message de confirmation
    expect(mockSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });

    // Vérifie que la méthode logOut a bien été appelée
    expect(sessionService.logOut).toHaveBeenCalled();

    // Vérifie que l'utilisateur a été redirigé vers "/"
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  /**
   * Vérifie que les informations de l’utilisateur sont bien récupérées au chargement.
   */
  it('should get user informations', () => {
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');

    req.flush({
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    });

    expect(component.user).toEqual({
      id: 1,
      admin: true,
      token: 'token',
      type: 'Bearer',
      username: 'Test1',
      firstName: 'Test',
      lastName: 'Test'
    });
    
  });
});
