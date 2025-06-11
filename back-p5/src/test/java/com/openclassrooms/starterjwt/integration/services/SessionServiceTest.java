package com.openclassrooms.starterjwt.integration.services;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
public class SessionServiceTest {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;

    private Session session;
    private Session session2;
    private User user;


    @BeforeEach
    public void setUp() {
         session = Session.builder()
                .name("Yoga Session")
                .date(new Date()) 
                .description("Une session de yoga pour débutants")
                .users(new ArrayList<>()) // Pas de participants au départ
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
         
        
         session2 = Session.builder()
                .name("Yoga Session 2")
                .date(new Date())
                .description("Une autre session de yoga pour débutants")
                .users(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
         
         user = User.builder()
                 .email("user@test.com")
                 .lastName("Test")
                 .firstName("Test")
                 .password("test!1234")
                 .admin(false)
                 .createdAt(LocalDateTime.now())
                 .updatedAt(LocalDateTime.now())
                 .build();
         
    }

    /**
     * Teste la création d'une session via le service.
     * Vérifie qu'elle est bien enregistrée et retrouvable dans la base.
     */

    @Test
    void testCreateSession() {
        // Appel de la méthode du service pour créer la session
        Session createdSession = sessionService.create(session);

        // Vérification que la session créée est bien celle retournée par le service
        assertThat(createdSession).isEqualTo(session);
        
        // Vérification que la session a bien été enregistrée dans la base de données
        Session foundSession = sessionRepository.findById(createdSession.getId()).orElse(null);
        assertThat(foundSession).isNotNull();
        assertThat(foundSession.getId()).isEqualTo(createdSession.getId());
    }
    
    /**
     * Teste la suppression d'une session via le service.
     * Vérifie qu'elle n'existe plus en base après suppression.
     */
    @Test
    void testDeleteSession() {
        // Créer et enregistrer la session
        Session createdSession = sessionService.create(session);

        // Appeler la méthode de suppression avec l'ID de la session créée
        sessionService.delete(createdSession.getId());

        // Vérification que la session n'existe plus dans la base de données
        Optional<Session> deletedSession = sessionRepository.findById(createdSession.getId());
        assertThat(deletedSession).isEmpty();
    }

    
    /**
     * Teste la récupération de toutes les sessions via le service.
     * Vérifie que les sessions créées sont bien présentes dans le résultat.
     */
    @Test
    void testFindAllSessions() {
        // Enregistrer la session pour le test
        Session createdSession = sessionService.create(session);
        Session createdSession2 = sessionService.create(session2);

        // Appel de la méthode findAll du service
        List<Session> sessionListFound = sessionService.findAll();

        // Vérification que la session créée est présente dans la liste récupérée
        assertThat(sessionListFound).contains(createdSession);
        assertThat(sessionListFound).contains(createdSession2); 
    }

    /**
     * Teste la récupération d'une session par son ID.
     * Vérifie que la session retournée correspond à celle enregistrée.
     */
	@Test
	void testFindSessionById() {
		
        Session createdSession = sessionService.create(session);

	    // Simulation de l'appel de la méthode du service
	    Session sessionFound = sessionService.getById(createdSession.getId());

	    // Vérification que la session trouvée est celle attendue
	    assertEquals(createdSession, sessionFound);
	}
	
	/**
	 * Teste la mise à jour d'une session existante.
	 * Vérifie que les modifications sont bien enregistrées.
	 */
	@Test
	void testUpdateSession() {
	    // Créer et enregistrer la session initiale
	    Session createdSession = sessionService.create(session);

	    Session updatedData = Session.builder()
	    	    .name("Yoga Session Updated")
	    	    .date(new Date())
	    	    .description("Updated description")
	    	    .createdAt(LocalDateTime.now())
	    	    .updatedAt(LocalDateTime.now())
	    	    .users(new ArrayList<>())
	    	    .build();


	    // Appel de la méthode update
	    Session sessionUpdated = sessionService.update(createdSession.getId(), updatedData);

	    // Vérification que le nom de la session a bien été mis à jour dans la base de données
	    Session foundSession = sessionRepository.findById(createdSession.getId()).orElse(null);
	    assertThat(foundSession).isNotNull();
	    assertEquals("Yoga Session Updated", foundSession.getName());

	    // Vérification que la session mise à jour est bien celle retournée
	    assertEquals(sessionUpdated.getId(), createdSession.getId());
	    assertEquals(sessionUpdated.getName(), "Yoga Session Updated");
	}
	
	/**
	 * Teste l'inscription d'un utilisateur à une session.
	 * Vérifie que l'utilisateur est bien ajouté à la session.
	 */
	@Test
	void testParticipate() {
		
	    User createdUser = userRepository.save(user);
		
	    // Créer et enregistrer une session initiale
	    Session createdSession = sessionService.create(session);

	    // L'utilisateur participe d'abord à la session
	    sessionService.participate(createdSession.getId(), createdUser.getId());

	    // Récupérer la session mise à jour
	    Session updatedSession = sessionRepository.findById(createdSession.getId()).orElse(null);
	    
	    // Vérifier que l'utilisateur est bien présent dans la session
	    assertThat(updatedSession).isNotNull();
	    assertTrue(updatedSession.getUsers().stream()
	            .map(User::getId)
	            .collect(Collectors.toList())
	            .contains(createdUser.getId())); 
	    
	}
	
	/**
	 * Teste le désabonnement d'un utilisateur d'une session.
	 * Vérifie que l'utilisateur est bien retiré de la session.
	 */
	@Test
	void testNoLongerParticipate() {		
		
	    User createdUser = userRepository.save(user);

	    // Créer et enregistrer une session initiale
	    Session createdSession = sessionService.create(session);

	    // L'utilisateur participe d'abord à la session
	    sessionService.participate(createdSession.getId(), createdUser.getId());

	    // Appel de la méthode noLongerParticipate
	    sessionService.noLongerParticipate(createdSession.getId(), createdUser.getId());

	    // Récupérer la session mise à jour
	    Session updatedSession = sessionRepository.findById(createdSession.getId()).orElse(null);
	    
	    // Vérifier que l'utilisateur a bien été retiré de la session
	    assertThat(updatedSession).isNotNull();
	    assertFalse(updatedSession.getUsers().stream()
	    	    .map(User::getId)
	    	    .collect(Collectors.toList())
	    	    .contains(createdUser.getId()));

	}
	
	 
}
