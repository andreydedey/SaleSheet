package com.example.salesheet.services;

import com.example.salesheet.dto.InviteDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.Status;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @Mock SpreadsheetRepository spreadsheetRepository;
    @Mock EmailService emailService;
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

    @Test
    void updateSalesperson_throwsNotFound_whenUserMissing() {
        var id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateSalesperson(id, new InviteDTO("new@email.com", "New Name")))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(NOT_FOUND);

        verify(userRepository, never()).save(any());
    }

    @Test
    void updateSalesperson_updatesNameAndEmail() {
        var id = UUID.randomUUID();
        var user = new User();
        user.setId(id);
        user.setName("Old Name");
        user.setEmail("old@email.com");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        userService.updateSalesperson(id, new InviteDTO("new@email.com", "New Name"));

        assertThat(user.getName()).isEqualTo("New Name");
        assertThat(user.getEmail()).isEqualTo("new@email.com");
        verify(userRepository).save(user);
    }

    @Test
    void deleteSalesperson_throwsNotFound_whenUserMissing() {
        var id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteSalesperson(id))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(NOT_FOUND);

        verify(userRepository, never()).delete(any());
    }

    @Test
    void deleteSalesperson_deletesUser() {
        var id = UUID.randomUUID();
        var user = new User();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(spreadsheetRepository.countByUserIdAndStatusNot(eq(id), any())).thenReturn(0L);

        userService.deleteSalesperson(id);

        verify(spreadsheetRepository).deleteAllByUserId(id);
        verify(userRepository).delete(user);
    }

    @Test
    void deleteSalesperson_throwsConflict_whenHasActiveOrDraftSpreadsheets() {
        var id = UUID.randomUUID();
        var user = new User();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(spreadsheetRepository.countByUserIdAndStatusNot(eq(id), any())).thenReturn(2L);

        assertThatThrownBy(() -> userService.deleteSalesperson(id))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode().value())
                .isEqualTo(409);
    }
}
