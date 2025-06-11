package com.openclassrooms.starterjwt.integration.controllers;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;


import java.util.Collections;
import java.util.Date;

import javax.transaction.Transactional;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


import com.openclassrooms.starterjwt.models.Session;

import com.openclassrooms.starterjwt.repository.SessionRepository;



@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(roles = {"USER"})
public class SessionControllerTest {
	
	 	@Autowired
	    private MockMvc mockMvc;
	    
	    @Autowired
	    private SessionRepository sessionRepository;

	    private Session session;
	    private Session session2;

	
	    @BeforeEach
	    public void setup() {
	        session = Session.builder()
	                .name("Yoga Session")
	                .date(new Date()) 
	                .description("Une session de yoga pour debutants")
	                .users(Collections.emptyList())  
	                .build();
	        
	        session2 = Session.builder()
	                .name("Yoga Session")
	                .date(new Date())
	                .description("Une session de yoga pour debutants")
	                .users(Collections.emptyList())  
	                .build();
		        
	    }
	    
	    
	    /**
	     * Vérifie si la récupération d'une session est bien réussie
	     **/
	    
	    @Test
	    public void whenCallGetById_thenReturnResponseEntityWithSession() throws Exception {
	    	
	    	// On enregistre la session dans la base de donnée 
	        sessionRepository.save(session);
	
	        // Effectue une requête GET et vérifie le statut de la réponse
	        mockMvc.perform(get("/api/session/{id}", session.getId()))
	                .andExpect(MockMvcResultMatchers.status().isOk())
	                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(session.getId()))
	                .andReturn();

	    }
	    
	    /**
	     * Vérifie si la récupération de l'ensemble des sessions est réussie
	     **/
	    
	    @Test
	    public void whenCallFindAll_thenReturnResponseEntityWithListOfSessions() throws Exception {
	    	
	    	// On enregistre 2 sessions dans la base de donnée 
	       sessionRepository.save(session);
	       sessionRepository.save(session2);
	
	        // Effectue une requête GET sur /api/teacher et vérifie le statut de la réponse
	        mockMvc.perform(get("/api/session"))
	                .andExpect(MockMvcResultMatchers.status().isOk())
	                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("\"id\":" + session.getId())))
	                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("\"id\":" + session2.getId())))
	                .andReturn();
	
	    }
	    
	    /**
	     * Vérifie si une session voulant être récupérer est introuvable
	     **/
	    
	    @Test
	    public void whenSessionIdNotFound_thenReturnResponseEntityNotFound() throws Exception {
	
	        // Effectue une requête GET avec l'ID et vérifie que le statut est 404 Not Found
	        mockMvc.perform(get("/api/session/{id}", "123"))
	                .andExpect(MockMvcResultMatchers.status().isNotFound())
	                .andReturn();
	    }
	    
	    
	    /**
	     * Vérifie si l'id pour trouver une session est invalide
	     **/
	    
	    @Test
	    public void whenInvalidSessionIdProvided_thenReturnResponseEntityBadRequest() throws Exception {
	        // Effectue une requête GET avec un ID invalide (non numérique) et vérifie le statut Bad Request
	        mockMvc.perform(get("/api/session/{id}", "abc"))
	                .andExpect(MockMvcResultMatchers.status().isBadRequest());
	    }
	    
	       
	    /**
	     * Vérifie la suppression d'une session
	     **/
	    
	    @Test
	    public void whenDeleteValidId_thenReturnOk() throws Exception {
	    	
	    	// On enregistre la session dans la base de donnée 
	        sessionRepository.save(session);
	    	
	        // Effectue la requête DELETE et vérifie le statut 200 OK
	        mockMvc.perform(delete("/api/session/{id}", session.getId()))
	        	.andExpect(MockMvcResultMatchers.status().isOk());
	    }
	    
	    /**
	     * Vérifie si une session voulant être supprimé est introuvable
	     **/
	    
	    @Test
	    public void whenDeleteNonExistentId_thenReturnNotFound() throws Exception {
	
	        // Effectue une requête DELETE avec un ID inexistant et vérifie le statut 404 Not Found
	        mockMvc.perform(delete("/api/session/{id}", "123"))
	               .andExpect(MockMvcResultMatchers.status().isNotFound());
	    }
	    
	    /**
	     * Vérifie si l'id pour supprimer une session est invalide
	     **/
	    
	    @Test
	    public void whenInvalidIdFormat_thenReturnBadRequest() throws Exception {
	        // Effectue la requête DELETE avec un ID invalide et vérifie le statut 400 Bad Request
	        mockMvc.perform(delete("/api/session/{id}", "invalid-id"))
	        		.andExpect(MockMvcResultMatchers.status().isBadRequest());
	    }

}
