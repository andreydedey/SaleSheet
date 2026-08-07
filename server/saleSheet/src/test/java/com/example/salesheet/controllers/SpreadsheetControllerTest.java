package com.example.salesheet.controllers;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.services.CustomOAuth2UserService;
import com.example.salesheet.security.OAuth2LoginSuccessHandler;
import com.example.salesheet.services.SpreadsheetService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.example.salesheet.enums.SpreadSheetStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SpreadsheetController.class)
class SpreadsheetControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean SpreadsheetService spreadsheetService;
    @MockitoBean CustomOAuth2UserService customOAuth2UserService;
    @MockitoBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    private SpreadSheetDTO buildSpreadSheetDTO(Long id) {
        return new SpreadSheetDTO(id, "PLN-001", LocalDateTime.now(), null, "DRAFT");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listSpreadsheets_returnsPage() throws Exception {
        var item = new SpreadSheetListDTO(1L, "PLN-001", null, 5L, 2L, SpreadSheetStatus.ACTIVE);
        var page = new PageImpl<>(List.of(item), PageRequest.of(0, 20), 1);
        when(spreadsheetService.list(any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/spreadsheets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("PLN-001"))
                .andExpect(jsonPath("$.content[0].status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createSpreadsheet_returnsCreated() throws Exception {
        var dto = new SpreadSheetCreateDTO(UUID.randomUUID(), "PLN-001");
        var created = buildSpreadSheetDTO(1L);
        when(spreadsheetService.create(any())).thenReturn(created);

        mockMvc.perform(post("/spreadsheets")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("PLN-001"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_returnsSpreadsheet() throws Exception {
        when(spreadsheetService.getById(1L)).thenReturn(buildSpreadSheetDTO(1L));

        mockMvc.perform(get("/spreadsheets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_returnsNotFound_whenMissing() throws Exception {
        when(spreadsheetService.getById(99L))
                .thenThrow(new ResponseStatusException(NOT_FOUND));

        mockMvc.perform(get("/spreadsheets/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteSpreadsheet_returnsNoContent() throws Exception {
        doNothing().when(spreadsheetService).delete(1L);

        mockMvc.perform(delete("/spreadsheets/1").with(csrf()))
                .andExpect(status().isNoContent());

        verify(spreadsheetService).delete(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void emitSpreadsheet_returnsUpdatedSpreadsheet() throws Exception {
        var emitted = new SpreadSheetDTO(1L, "PLN-001", LocalDateTime.now(), LocalDateTime.now(), "ACTIVE");
        when(spreadsheetService.emit(1L)).thenReturn(emitted);

        mockMvc.perform(post("/spreadsheets/1/emit").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

}
