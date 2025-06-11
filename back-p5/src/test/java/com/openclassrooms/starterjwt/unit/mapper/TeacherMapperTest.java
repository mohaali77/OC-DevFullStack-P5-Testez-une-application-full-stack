package com.openclassrooms.starterjwt.unit.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;

@SpringBootTest
public class TeacherMapperTest {
	
	@Autowired
	TeacherMapper teacherMapper;
	
	/**
     * Vérifie la conversion d'un objet DTO en entité .
     */
	
    @Test
    public void whenConvertUserDtoToEntity_thenCorrect() {
    	
        // Création du DTO qui sera testé pour la conversion
        TeacherDto dto = new TeacherDto();
        dto.setId(123L); 
        dto.setFirstName("Test"); 
        dto.setLastName("Test");
        dto.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));

        // Appel de la méthode qui va convertir le DTO vers l'entité User
        Teacher teacher = teacherMapper.toEntity(dto);

        // Vérification que la conversion a fonctionné en comparant les valeurs de l'entité et du DTO       
        assertThat(teacher).isNotNull(); 
        assertThat(teacher.getId()).isEqualTo(dto.getId()); 
        assertThat(teacher.getFirstName()).isEqualTo(dto.getFirstName()); 
        assertThat(teacher.getLastName()).isEqualTo(dto.getLastName()); 
        assertThat(teacher.getCreatedAt()).isEqualTo(dto.getCreatedAt()); 
        assertThat(teacher.getUpdatedAt()).isEqualTo(dto.getUpdatedAt());
    }
    
    
    /**
     * Vérifie la conversion d'une liste de DTO en une liste d'entités .
     */
    @Test
    public void whenConvertDtoListToEntityList_thenCorrect() {
    	
    	TeacherDto dto = new TeacherDto();
        dto.setId(123L); 
        dto.setFirstName("Test"); 
        dto.setLastName("Test"); 
        dto.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        TeacherDto dto2 = new TeacherDto();
        dto2.setId(124L); 
        dto2.setFirstName("Test"); 
        dto2.setLastName("Test");
        dto2.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto2.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        List<Teacher> teachers = teacherMapper.toEntity(Arrays.asList(dto, dto2));

        assertThat(teachers).hasSize(2);

        assertThat(teachers.get(0).getId()).isEqualTo(dto.getId());
        assertThat(teachers.get(1).getFirstName()).isEqualTo(dto2.getFirstName());
    }
    
    /**
     * Vérifie la conversion d'une liste d'entités en une liste de DTO.
     */
    
    @Test
    public void whenConvertEntityListToDtoList_thenCorrect() {
    	Teacher teacher = new Teacher();
    	teacher.setId(123L); 
    	teacher.setFirstName("Test"); 
    	teacher.setLastName("Test");
    	teacher.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
    	teacher.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        Teacher teacher2 = new Teacher();
        teacher2.setId(124L); 
        teacher2.setFirstName("Test"); 
        teacher2.setLastName("Test");
        teacher2.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        teacher2.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        List<TeacherDto> dtos = teacherMapper.toDto(Arrays.asList(teacher, teacher2));

        assertThat(dtos).hasSize(2);

        assertThat(dtos.get(0).getId()).isEqualTo(teacher.getId());
        assertThat(dtos.get(1).getFirstName()).isEqualTo(teacher2.getFirstName());
    }
}
