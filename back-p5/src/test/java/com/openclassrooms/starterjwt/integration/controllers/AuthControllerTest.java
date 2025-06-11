package com.openclassrooms.starterjwt.integration.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {
	
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;


    /**
     * Vérifie que la connexion de l'utilisateur est un succès 
     * */
    @Test
    public void testLoginUser_Success() throws Exception {

    	//Création d'un email
        String email = "test+" + UUID.randomUUID() + "@test.com";

        //Création d'un utilisateur avec l'email créé et le mot de passe encodé
        User user = User.builder()
                .email(email)
                .firstName("Test")
                .lastName("Test")
                .password(passwordEncoder.encode("test!1234"))
                .admin(false)
                .build();

        // Enregistrement de l'utilisateur en BDD
        userRepository.save(user);

        // Exécution de la requête POST avec mot de passe BRUT
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"test!1234\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(jsonPath("$.username").value(email))
            .andExpect(jsonPath("$.admin").value(false));
        
    }


    /**
     * Vérifie que l'inscription de l'utilisateur est un succès
     */
    @Test
    public void testRegisterUser_Success() throws Exception {
        
    	//Création d'un email
        String email = "test+" + UUID.randomUUID() + "@test.com";
        
    	//Création d'un mot de passe BRUT
        String rawPassword = "test!1234";

        // Exécution de la requête POST avec mot de passe BRUT
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email +
                        "\",\"firstName\":\"Test" +
                        "\",\"lastName\":\"Test" +
                        "\",\"password\":\"" + rawPassword + "\"}"))
            .andExpect(status().isOk())
            .andExpect(content().json("{\"message\":\"User registered successfully!\"}"));

        // Vérifier que l'utilisateur a bien été sauvegardé dans la base
        assertTrue(userRepository.existsByEmail(email));
        
    }

    
    /**
     * Vérifie qu'une erreur est bien retounée en cas d'email déjà présent
     * */
     
    @Test
    public void testRegisterUser_EmailAlreadyTaken() throws Exception {
    	
    	//Création d'un email
        String email = "test+" + UUID.randomUUID() + "@test.com";

        //Création d'un utilisateur avec l'email créé et le mot de passe BRUT
        User user = User.builder()
                .email(email)
                .firstName("Test")
                .lastName("Test")
                .password(passwordEncoder.encode("test!1234"))
                .admin(false)
                .build();

        // Enregistrement de l'utilisateur en BDD
        userRepository.save(user);
                
        // Exécution de la requête POST avec un email déjà existant
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email +
                        "\",\"firstName\":\"" + user.getFirstName() +
                        "\",\"lastName\":\"" + user.getLastName() + 
                        "\",\"password\":\"" + "test!1234" + "\"}")) 
                .andExpect(content().json("{\"message\":\"Error: Email is already taken!\"}"))
                .andExpect(status().isBadRequest());
        
        
    } 

}
