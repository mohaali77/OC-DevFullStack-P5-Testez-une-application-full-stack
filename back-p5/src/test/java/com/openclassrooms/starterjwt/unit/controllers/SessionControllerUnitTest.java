package com.openclassrooms.starterjwt.unit.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class SessionControllerUnitTest {

	    
	    @InjectMocks
	    private SessionController sessionController;
	    
	    @Mock
	    private SessionService sessionService;

	    @Mock
	    private SessionMapper sessionMapper;

	    
	    private Session session;
	    private SessionDto inputDto;
	    private SessionDto expectedDto;
	
	    @BeforeEach
	    void setup() {
	        session = Session.builder()
	                .name("Yoga Session")
	                .description("Une session de yoga pour débutants")
	                .users(Collections.emptyList())
	                .build();

	        //DTO reçu par le client 
	        inputDto = new SessionDto();
	        inputDto.setName("Yoga Session");
	        inputDto.setDescription("Une session de yoga pour débutants");

	        //DTO renvoyé en réponse par la requête
	        expectedDto = new SessionDto();
	        expectedDto.setName("Yoga Session");
	        expectedDto.setDescription("Une session de yoga pour débutants");
	    }

	    /**
	     * Test de la création d'une session avec des données valides.
	     * Vérifie que le statut de la réponse est OK et que la session retournée est correcte.
	     */
	    @Test
	    void whenCallCreate_thenReturnResponseEntityWithNewSession() {
	        when(sessionMapper.toEntity(inputDto)).thenReturn(session);
	        when(sessionService.create(session)).thenReturn(session);
	        when(sessionMapper.toDto(session)).thenReturn(expectedDto);

	        ResponseEntity<?> response = sessionController.create(inputDto);

	        assertEquals(HttpStatus.OK, response.getStatusCode());
	        assertEquals(expectedDto, response.getBody());
	    }
	    
	    /**
	     * Test de la mise à jour d'une session avec des données valides.
	     * Vérifie que le statut de la réponse est OK et que la session mise à jour est retournée.
	     */
	    
	    @Test
	    void whenCallUpdate_thenReturnResponseEntityWithNewSession() {
	        Long sessionId = 1L;

	        when(sessionMapper.toEntity(inputDto)).thenReturn(session);
	        when(sessionService.update(sessionId, session)).thenReturn(session);
	        when(sessionMapper.toDto(session)).thenReturn(expectedDto);

	        ResponseEntity<?> response = sessionController.update(String.valueOf(sessionId), inputDto);

	        assertEquals(HttpStatus.OK, response.getStatusCode());
	        assertEquals(expectedDto, response.getBody());
	    }


	    /**
	     * Test du cas où l'identifiant passé pour la mise à jour n'est pas un nombre valide.
	     * Vérifie que le contrôleur retourne une réponse BAD_REQUEST.
	     */
	    @Test
	    void whenInvalidIdFormat_thenReturnBadRequestOnUpdate() {
	        ResponseEntity<?> response = sessionController.update("abc", inputDto);

	        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	    }

	    /**
	     * Test de la participation à une session avec des identifiants valides.
	     * Vérifie que le statut de la réponse est OK.
	     */
	    
	    @Test
	    void whenValidIds_thenParticipateSuccessfully() {
	        doNothing().when(sessionService).participate(123L, 456L);
	
	        ResponseEntity<?> response = sessionController.participate("123", "456");
	
	        assertEquals(HttpStatus.OK, response.getStatusCode());
	     }
	
	    

	    /**
	     * Test du cas où l'identifiant de participation n'est pas un nombre valide.
	     * Vérifie que le contrôleur retourne une réponse BAD_REQUEST.
	     */	    
	    @Test
	    void whenInvalidParticipateIdFormat_thenReturnBadRequest() {
	    	
	        ResponseEntity<?> response = sessionController.participate("abc", "456");
	        
		    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	    }
	    
	    /**
	     * Test de la suppression de la participation à une session avec des identifiants valides.
	     * Vérifie que le statut de la réponse est OK.
	     */
	    @Test
	    void whenValidIds_thenNoLongerParticipateSuccessfully() {
	        doNothing().when(sessionService).noLongerParticipate(123L, 456L);
	
	        ResponseEntity<?> response = sessionController.noLongerParticipate("123", "456");
	
	        assertEquals(HttpStatus.OK, response.getStatusCode());
	     }
	
	    /**
	     * Test du cas où l'identifiant pour la suppression de participation n'est pas un nombre valide.
	     * Vérifie que le contrôleur retourne une réponse BAD_REQUEST.
	     */
	    @Test 
	    void whenInvalidNoParticipateIdFormat_thenReturnBadRequest() {
	        ResponseEntity<?> response = sessionController.noLongerParticipate("abc", "456");
	
	        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	    }
    
}
