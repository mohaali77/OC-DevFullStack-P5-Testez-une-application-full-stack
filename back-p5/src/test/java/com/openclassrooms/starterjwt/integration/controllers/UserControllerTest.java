package com.openclassrooms.starterjwt.integration.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import javax.transaction.Transactional;

import static org.junit.jupiter.api.Assertions.assertFalse;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username = "test@test.com", roles = {"USER"})
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setup() {
        user = User.builder()
                .email("test@test.com")
                .lastName("Test")
                .firstName("Test")
                .password("test!1234")
                .admin(false)
                .build();
        
    }
    
    /**
     * Vérifie que l'utilisateur est bien récupéré avec un ID valide.
     */
    
    @Test
    public void whenFindByIdWithCorrectUser_thenReturnResponseEntityWithUser() throws Exception {
        // Sauvegarde l'utilisateur dans la base de données
        userRepository.save(user);
        
        // Effectue une requête GET avec l'ID de l'utilisateur enregistré
         mockMvc.perform(get("/api/user/{id}", user.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                // Vérifie que l'ID et l'email sont corrects
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.email").value(user.getEmail()))
                .andReturn();

    }
    
    /**
     * Vérifie que la récupération échoue avec un ID inexistant (404).
     */
    
    @Test
    public void whenUserIdNotFound_thenReturnResponseEntityNotFound() throws Exception {

        // Effectue une requête GET avec un ID inexistant
        mockMvc.perform(get("/api/user/{id}", 123L))
               .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
    
    /**
     * Vérifie que la récupération échoue avec un ID invalide (400).
     */
    
    @Test
    public void whenInvalidUserIdProvided_thenReturnResponseEntityBadRequest() throws Exception {
    	
        // Effectue une requête GET avec un ID invalide (non numérique) et vérifie le statut Bad Request
        mockMvc.perform(get("/api/user/{id}", "abc"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
    
    /**
     * Vérifie que la suppression réussit avec un utilisateur existant.
     */
    
    @Test
    public void whenDeleteWithCorrectUser_thenReturnOk() throws Exception {
    	
    	userRepository.save(user);
    	
        // Effectue la requête DELETE et vérifie le statut 200 OK
        mockMvc.perform(delete("/api/user/{id}", user.getId()))
        	.andExpect(MockMvcResultMatchers.status().isOk());
        
        assertFalse(userRepository.findById(user.getId()).isPresent());

    }
    
    /**
     * Vérifie que la suppression échoue si l'utilisateur n'existe pas (404).
     */
    
    @Test
    public void whenUserNotFound_thenReturnNotFound() throws Exception {

        // Effectue la requête DELETE et vérifie le statut 404 Not Found
        mockMvc.perform(delete("/api/user/{id}", "123"))
        .andExpect(MockMvcResultMatchers.status().isNotFound());
        
    }
    
    /**
     * Vérifie qu'un utilisateur non authentifié ne peut pas supprimer (401).
     */
    
    @Test
    @WithAnonymousUser
    public void whenUserIsNotAuthorized_thenReturnUnauthorized() throws Exception {
    	
    	userRepository.save(user);

        // Effectue une requête DELETE pour supprimer l'utilisateur avec l'ID donné
        mockMvc.perform(delete("/api/user/{id}", user.getId()))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized()); // Vérifie que la réponse est 401 Unauthorized
        
    }
    
    /**
     * Vérifie que la suppression échoue si l'ID est invalide (400).
     */
  
    @Test
    public void whenInvalidIdFormat_thenReturnBadRequest() throws Exception {
        // Effectue la requête DELETE avec un ID invalide et vérifie le statut 400 Bad Request
        mockMvc.perform(delete("/api/user/{id}", "invalid-id"))
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
    
    

}
