package com.example.salesheet.services;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@ExtendWith(MockitoExtension.class)
class SpreadsheetServiceTest {

    @Mock SpreadsheetRepository spreadsheetRepository;
    @Mock UserRepository userRepository;
    @Mock ProductRepository productRepository;
    @InjectMocks SpreadsheetService spreadsheetService;

    private User buildUser(UUID id) {
        var user = new User();
        user.setId(id);
        user.setName("Ana");
        user.setEmail("ana@email.com");
        return user;
    }

    private SpreadSheet buildSpreadsheet(Long id, User user, SpreadSheetStatus status) {
        var ss = new SpreadSheet();
        ss.setId(id);
        ss.setName("PLN-001");
        ss.setUser(user);
        ss.setStatus(status);
        return ss;
    }

    @Test
    void create_throwsNotFound_whenUserMissing() {
        var dto = new SpreadSheetCreateDTO(UUID.randomUUID(), "PLN-001");
        when(userRepository.findById(dto.getSalespersonId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.create(dto))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void create_savesSpreadsheetAndReturnsDTO() {
        var userId = UUID.randomUUID();
        var user = buildUser(userId);
        var dto = new SpreadSheetCreateDTO(userId, "PLN-001");
        var saved = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(spreadsheetRepository.save(any())).thenReturn(saved);

        var result = spreadsheetService.create(dto);

        assertThat(result.getName()).isEqualTo("PLN-001");
        assertThat(result.getStatus()).isEqualTo("DRAFT");
        verify(spreadsheetRepository).save(any());
    }

    @Test
    void getById_throwsNotFound_whenMissing() {
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.getById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void getById_returnsDTO() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        var result = spreadsheetService.getById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("PLN-001");
    }

    @Test
    void updateStatus_throwsNotFound_whenMissing() {
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.updateStatus(99L, SpreadSheetStatus.ACTIVE))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void updateStatus_changesStatusAndReturnsDTO() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));
        when(spreadsheetRepository.save(any())).thenReturn(ss);

        var result = spreadsheetService.updateStatus(1L, SpreadSheetStatus.ACTIVE);

        assertThat(ss.getStatus()).isEqualTo(SpreadSheetStatus.ACTIVE);
        assertThat(result.getStatus()).isEqualTo("ACTIVE");
        verify(spreadsheetRepository).save(ss);
    }

    @Test
    void emit_throwsNotFound_whenSpreadsheetMissing() {
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.emit(99L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void emit_throwsUnprocessable_whenNoUser() {
        var ss = new SpreadSheet();
        ss.setId(1L);
        ss.setName("PLN-001");
        ss.setStatus(SpreadSheetStatus.DRAFT);
        // user is null
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        assertThatThrownBy(() -> spreadsheetService.emit(1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(UNPROCESSABLE_ENTITY);
    }

    @Test
    void emit_throwsUnprocessable_whenNoProducts() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));
        when(productRepository.countBySpreadSheetId(1L)).thenReturn(0L);

        assertThatThrownBy(() -> spreadsheetService.emit(1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(UNPROCESSABLE_ENTITY);
    }

    @Test
    void emit_setsStatusActiveAndIssuedAt() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));
        when(productRepository.countBySpreadSheetId(1L)).thenReturn(3L);
        when(spreadsheetRepository.save(any())).thenReturn(ss);

        spreadsheetService.emit(1L);

        assertThat(ss.getStatus()).isEqualTo(SpreadSheetStatus.ACTIVE);
        assertThat(ss.getIssuedAt()).isNotNull();
        verify(spreadsheetRepository).save(ss);
    }

    @Test
    void delete_throwsNotFound_whenMissing() {
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.delete(99L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void delete_removesSpreadsheet() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        spreadsheetService.delete(1L);

        verify(spreadsheetRepository).delete(ss);
    }

    @Test
    void updateSalesperson_throwsNotFound_whenSpreadsheetMissing() {
        var newUserId = UUID.randomUUID();
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.updateSalesperson(99L, newUserId))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void updateSalesperson_throwsNotFound_whenUserMissing() {
        var user = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        var newUserId = UUID.randomUUID();
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));
        when(userRepository.findById(newUserId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> spreadsheetService.updateSalesperson(1L, newUserId))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void updateSalesperson_assignsNewUserAndReturnsDTO() {
        var originalUser = buildUser(UUID.randomUUID());
        var ss = buildSpreadsheet(1L, originalUser, SpreadSheetStatus.DRAFT);
        var newUserId = UUID.randomUUID();
        var newUser = buildUser(newUserId);
        newUser.setName("Carlos");
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));
        when(userRepository.findById(newUserId)).thenReturn(Optional.of(newUser));
        when(spreadsheetRepository.save(any())).thenReturn(ss);

        var result = spreadsheetService.updateSalesperson(1L, newUserId);

        assertThat(ss.getUser()).isEqualTo(newUser);
        assertThat(result).isNotNull();
        verify(spreadsheetRepository).save(ss);
    }

    @Test
    void getByIdForUser_throwsForbidden_whenUserDoesNotOwn() {
        var owner = buildUser(UUID.randomUUID());
        var otherUserId = UUID.randomUUID();
        var ss = buildSpreadsheet(1L, owner, SpreadSheetStatus.ACTIVE);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        assertThatThrownBy(() -> spreadsheetService.getByIdForUser(1L, otherUserId))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(FORBIDDEN);
    }

    @Test
    void getByIdForUser_throwsNotFound_whenStatusIsDraft() {
        var userId = UUID.randomUUID();
        var user = buildUser(userId);
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.DRAFT);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        assertThatThrownBy(() -> spreadsheetService.getByIdForUser(1L, userId))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void getByIdForUser_returnsDTO_whenOwnerAndNotDraft() {
        var userId = UUID.randomUUID();
        var user = buildUser(userId);
        var ss = buildSpreadsheet(1L, user, SpreadSheetStatus.ACTIVE);
        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(ss));

        var result = spreadsheetService.getByIdForUser(1L, userId);

        assertThat(result.getId()).isEqualTo(1L);
    }
}
