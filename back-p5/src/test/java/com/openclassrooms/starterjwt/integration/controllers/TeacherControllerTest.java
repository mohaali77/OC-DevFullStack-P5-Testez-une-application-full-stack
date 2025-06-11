package com.openclassrooms.starterjwt.integration.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import javax.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(roles = {"USER"})
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private TeacherRepository teacherRepository;

    private Teacher teacher;
    private Teacher teacher2;

    
    /**
     * Vérifie si la récupération d'un professeur est bien réussie
     **/

    @Test
    public void whenCallFindById_thenReturnResponseEntityWithTeacher() throws Exception {
    	
    	teacher = Teacher.builder()
                .lastName("Teacher")
                .firstName("One")
                .build();
    	
    	// On enregistre le professeur dans la base de donnée 
        teacherRepository.save(teacher);

        // Vérifie que la réponse renvoie 200 et que le JSON contient le professeur attendu
        mockMvc.perform(get("/api/teacher/{id}", teacher.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(teacher.getId()));

    }
    
    /**
     * Vérifie qu'une liste de professeurs est bien retournée lors de l'appel api
     * */
    
    @Test
    public void whenCallFindAll_thenReturnResponseEntityWithListOfTeachers() throws Exception {
    	
    	//Création des deux professeurs
        teacher = Teacher.builder()
                .lastName("Teacher")
                .firstName("One")
                .build();

        teacher2 = Teacher.builder()
                .lastName("Teacher")
                .firstName("Two")
                .build();

        //Enregistrement des deux professeurs dans la base de données
        teacherRepository.save(teacher);
        teacherRepository.save(teacher2);

        // Vérifie que la réponse renvoie 200 et que le JSON contient les professeurs attendus
        mockMvc.perform(get("/api/teacher"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("\"id\":" + teacher.getId())))
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("\"id\":" + teacher2.getId())));

    }


    /**
     * Vérifie qu'une erreur est retournée en cas d'id introuvable
     * */
    
    @Test
    public void whenTeacherIdNotFound_thenReturnResponseEntityNotFound() throws Exception {

        // Effectue une requête GET avec l'ID et vérifie le statut Not Found
        mockMvc.perform(get("/api/teacher/{id}", "9999999"))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andReturn();
    }
       
    /**
     * Vérifie qu'une erreur est retournée en cas d'id invalide
     * */   
    @Test
    public void whenInvalidTeacherIdProvided_thenReturnResponseEntityBadRequest() throws Exception {
        // Effectue une requête GET avec un ID invalide (non numérique) et vérifie le statut Bad Request
        mockMvc.perform(get("/api/teacher/{id}", "abc"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

}