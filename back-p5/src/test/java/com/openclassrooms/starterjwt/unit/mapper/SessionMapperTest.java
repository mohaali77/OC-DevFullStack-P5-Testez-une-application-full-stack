package com.openclassrooms.starterjwt.unit.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    /**
     * Vérifie que la conversion d'un DTO en entité fonctionne
     */
    
    @Test
    public void whenConvertSessionDtoToEntity_thenCorrect() {
    	
    	//Création d'un objet session
    	Session session = new Session();
        session.setDescription("Test Session");

        //Création d'un professeur
        Teacher teacher = new Teacher();
        teacher.setId(10L);
        
        //Ajout du prof dans la session
        session.setTeacher(teacher);

        //Création des utilisateurs
        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        
        //Ajout des utilisateur dans la session
        session.setUsers(Arrays.asList(user1, user2));

        //Conversion de dto à session 
        SessionDto dto = sessionMapper.toDto(session);

        //Assert pour vérifier que les valeurs correspondent
        assertThat(dto).isNotNull();
        assertThat(dto.getDescription()).isEqualTo("Test Session");
        assertThat(dto.getTeacher_id()).isEqualTo(10L);
        assertThat(dto.getUsers()).containsExactlyInAnyOrder(1L, 2L);
    }

    /**
     * Vérifie que la conversion d'une entité en DTO fonctionne
     */
    
    @Test
    public void whenConvertEntityToSessionDto_thenCorrect() {
    	
        Session session = new Session();
        session.setDescription("Test Session");

        Teacher teacher = new Teacher();
        teacher.setId(10L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        session.setUsers(Arrays.asList(user1, user2));

        SessionDto dto = sessionMapper.toDto(session);

        assertThat(dto).isNotNull();
        assertThat(dto.getDescription()).isEqualTo("Test Session");
        assertThat(dto.getTeacher_id()).isEqualTo(10L);
        assertThat(dto.getUsers()).containsExactlyInAnyOrder(1L, 2L);
    }
}
