package com.example.salesheet.services;

import com.example.salesheet.dto.InviteDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.Status;
import com.example.salesheet.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.CONFLICT;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @InjectMocks UserService userService;

    @Test
    void inviteSalesperson_savesNewUser() {
        var dto = new InviteDTO("ana@email.com", "Ana");
        when(userRepository.findByEmail("ana@email.com")).thenReturn(Optional.empty());

        userService.inviteSalesperson(dto);

        var captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        var saved = captor.getValue();
        assertThat(saved.getEmail()).isEqualTo("ana@email.com");
        assertThat(saved.getName()).isEqualTo("Ana");
        assertThat(saved.getRole()).isEqualTo(Role.SALESPERSON);
        assertThat(saved.getStatus()).isEqualTo(Status.PENDING);
    }

    @Test
    void inviteSalesperson_throwsConflict_whenEmailAlreadyExists() {
        var dto = new InviteDTO("existing@email.com", "Ana");
        when(userRepository.findByEmail("existing@email.com")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> userService.inviteSalesperson(dto))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(CONFLICT);

        verify(userRepository, never()).save(any());
    }
}
