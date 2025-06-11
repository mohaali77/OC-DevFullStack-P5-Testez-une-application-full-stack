import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { of, throwError } from 'rxjs'; // Pour simuler les réponses asynchrones

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockSessionService: any; // Mock de SessionService
  let mockUserService: any; // Mock de UserService
  let mockSnackBar: any;
  let mockRouter: any;

  beforeEach(async () => {

    window.history.back = jest.fn(); // Mock de window.history.back

    mockSnackBar = {
      open: jest.fn() // Mock de la méthode open
    };

    mockRouter = {
      navigate: jest.fn() // Mock de la méthode navigate
    };

    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1,
      },
      logOut: jest.fn() // Mock de la méthode logOut
    };

    mockUserService = {
      delete: jest.fn().mockReturnValue(of({})),// Mock de la méthode 'delete' 
      getById: jest.fn().mockReturnValue(of({ id: 1, name: 'John Doe', admin: true })) // Mock de la méthode getById
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the method "back" to return previous page', () => {
    component.back(); // Appeler la méthode back du composant
    expect(window.history.back).toHaveBeenCalled(); // Vérifier que la méthode back a été appelée
  });

  it('should delete the user account', () => {
    component.delete(); // Appeler la méthode delete du composant
    expect(mockUserService.delete).toHaveBeenCalledWith(mockSessionService.sessionInformation.id.toString());
    expect(mockSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should get user informations', () => {
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith(mockSessionService.sessionInformation.id.toString());
    expect(component.user).toEqual({ id: 1, name: 'John Doe', admin: true }); // Utilise l'objet fictif que tu as retourné dans le mock
  });

});
