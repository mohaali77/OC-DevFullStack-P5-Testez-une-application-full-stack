package com.openclassrooms.starterjwt.integration.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class TeacherServiceTest {
	
    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherRepository teacherRepository;

    Teacher teacher;
    Teacher teacher2;

	
	@BeforeEach
    public void setUp() {    	
    // Enregistrement d'un professeur dans la base avant chaque test.

		    teacher = Teacher.builder()
                .firstName("Test")
                .lastName("Test")
                .createdAt(LocalDateTime.parse("2023-10-01T12:57:09"))
                .updatedAt(LocalDateTime.parse("2023-10-01T12:57:10"))
                .build();
		    
		    teacher2 = Teacher.builder()
	                .firstName("Test")
	                .lastName("Test")
	                .createdAt(LocalDateTime.parse("2023-10-01T12:57:09"))
	                .updatedAt(LocalDateTime.parse("2023-10-01T12:57:10"))
	                .build();
            
        	// On enregistre les professeurs dans la base de données avant chaque test
            teacher = teacherRepository.save(teacher);
            teacher2 = teacherRepository.save(teacher2);


    }

	 /**
     * Vérifie que la liste des professeurs est bien retournée.
     */
	
    @Test
    void testFindAllTeachers() {

    	// Appel de la méthode findAll du service
        List<Teacher> teacherListFound = teacherService.findAll();

        // Vérification que les professeurs enregistrés sont présents dans la liste récupérée
        assertThat(teacherListFound).contains(teacher);
        assertThat(teacherListFound).contains(teacher2);
    }
    
    /**
     * Vérifie que la récupération d'un professeur par ID fonctionne correctement.
     */

    @Test
    void testFindTeacherById() {
    	
        // On recherche le professeur par son ID
        Teacher foundTeacher = teacherService.findById(teacher.getId());

        // Vérification que le professeur trouvée est celui attendu
	    assertEquals(teacher.getId(), foundTeacher.getId());
    }    
    
}

