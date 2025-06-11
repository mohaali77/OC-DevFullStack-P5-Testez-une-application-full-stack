package com.openclassrooms.starterjwt.integration.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User user;

        
    @BeforeEach
    public void setUp() {    	
    // Enregistrement d'un utilisateur dans la base avant chaque test.

            user = User.builder()
                    .email("test@test.com")
                    .lastName("Test")
                    .firstName("Test")
                    .password("test!1234")
                    .admin(false)
                    .build();
            
        	// On enregistre l'utilisateur dans la base de données avant chaque test
            user = userRepository.save(user);
            
    }

    /**
     * Vérifie que l'utilisateur est bien supprimé de la base.
     */

    @Test
    public void testDeleteUser() {

        // On supprime l'utilisateur
        userService.delete(user.getId());

        // Vérification que l'utilisateur a bien été supprimé
        Optional<User> deletedUser = userRepository.findById(user.getId());
        assertThat(deletedUser).isEmpty();
    }
    
    /**
     * Vérifie que l'utilisateur retourné correspond à celui enregistré.
     */

    @Test
    public void testFindById() {
    	
    	// On enregistre l'utilisateur dans la base de données
        user = userRepository.save(user);

        // On recherche l'utilisateur par son ID
        User foundUser = userService.findById(user.getId());

        // Vérification que l'utilisateur trouvée est celui attendu
	    assertEquals(user.getId(), foundUser.getId());
    }
}
