package com.openclassrooms.starterjwt.unit.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserMapperTest {

    @Autowired
    private UserMapper userMapper;
    
    /**
     * Vérifie que la conversion d'un DTO en entité est correcte
     */

    @Test
    public void whenConvertUserDtoToEntity_thenCorrect() {
    	
        // Création du DTO qui sera testé pour la conversion
        UserDto dto = new UserDto();
        dto.setId(123L); 
        dto.setEmail("test@test.com"); 
        dto.setFirstName("Test"); 
        dto.setLastName("Test");
        dto.setPassword("test!1234"); 
        dto.setAdmin(true); 
        dto.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));

        // Appel de la méthode qui va convertir le DTO vers l'entité User
        User user = userMapper.toEntity(dto);

        // Vérification que la conversion a fonctionné en comparant les valeurs de l'entité et du DTO
        
        assertThat(user).isNotNull(); 
        assertThat(user.getId()).isEqualTo(dto.getId());
        assertThat(user.getEmail()).isEqualTo(dto.getEmail()); 
        assertThat(user.getFirstName()).isEqualTo(dto.getFirstName()); 
        assertThat(user.getLastName()).isEqualTo(dto.getLastName()); 
        assertThat(user.getPassword()).isEqualTo(dto.getPassword()); 
        assertThat(user.isAdmin()).isEqualTo(dto.isAdmin()); 
        assertThat(user.getCreatedAt()).isEqualTo(dto.getCreatedAt()); 
        assertThat(user.getUpdatedAt()).isEqualTo(dto.getUpdatedAt());

        
    }
    

    /**
     * Vérifie la conversion d'une liste de DTO en une liste d'entités.
     */
    @Test
    public void whenConvertDtoListToEntityList_thenCorrect() {
    	UserDto dto = new UserDto();
        dto.setId(123L); 
        dto.setEmail("test@test.com"); 
        dto.setFirstName("Test"); 
        dto.setLastName("Test");
        dto.setPassword("test!1234"); 
        dto.setAdmin(true); 
        dto.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        UserDto dto2 = new UserDto();
        dto2.setId(124L); 
        dto2.setEmail("test1@test.com"); 
        dto2.setFirstName("Test"); 
        dto2.setLastName("Test");
        dto2.setPassword("test!1234"); 
        dto2.setAdmin(true); 
        dto2.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        dto2.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        List<User> users = userMapper.toEntity(Arrays.asList(dto, dto2));

        assertThat(users).hasSize(2);

        assertThat(users.get(0).getId()).isEqualTo(dto.getId());
        assertThat(users.get(0).getEmail()).isEqualTo(dto.getEmail());
        assertThat(users.get(1).getFirstName()).isEqualTo(dto2.getFirstName());
        assertThat(users.get(1).isAdmin()).isEqualTo(dto2.isAdmin());
    }
    
    /**
     * Vérifie la conversion d'une liste d'entités en une liste de DTO.
     */
    @Test
    public void whenConvertEntityListToDtoList_thenCorrect() {
    	User user = new User();
        user.setId(123L); 
        user.setEmail("test@test.com"); 
        user.setFirstName("Test"); 
        user.setLastName("Test");
        user.setPassword("test!1234"); 
        user.setAdmin(true); 
        user.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        user.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        User user2 = new User();
        user2.setId(124L); 
        user2.setEmail("test1@test.com"); 
        user2.setFirstName("Test"); 
        user2.setLastName("Test");
        user2.setPassword("test!1234"); 
        user2.setAdmin(true); 
        user2.setCreatedAt(LocalDateTime.parse("2023-10-01T12:00:00"));
        user2.setUpdatedAt(LocalDateTime.parse("2023-10-01T12:30:00"));
        
        List<UserDto> dtos = userMapper.toDto(Arrays.asList(user, user2));

        assertThat(dtos).hasSize(2);

        assertThat(dtos.get(0).getId()).isEqualTo(user.getId());
        assertThat(dtos.get(0).getEmail()).isEqualTo(user.getEmail());
        assertThat(dtos.get(1).getFirstName()).isEqualTo(user2.getFirstName());
        assertThat(dtos.get(1).isAdmin()).isEqualTo(user2.isAdmin());
    }  
}
