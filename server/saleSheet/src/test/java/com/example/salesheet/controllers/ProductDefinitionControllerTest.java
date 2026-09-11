package com.example.salesheet.controllers;

import com.example.salesheet.dto.ProductDefinitionDTO;
import com.example.salesheet.dto.ProductDefinitionListDTO;
import com.example.salesheet.services.CustomOAuth2UserService;
import com.example.salesheet.security.OAuth2LoginSuccessHandler;
import com.example.salesheet.security.OAuth2LoginFailureHandler;
import com.example.salesheet.services.ProductDefinitionService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductDefinitionController.class)
class ProductDefinitionControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean ProductDefinitionService productDefinitionService;
    @MockitoBean CustomOAuth2UserService customOAuth2UserService;
    @MockitoBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    @MockitoBean OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    @Test
    @WithMockUser(roles = "ADMIN")
    void list_returnsDefinitions() throws Exception {
        var definitions = List.of(
                new ProductDefinitionDTO(1L, "BRINCO"),
                new ProductDefinitionDTO(2L, "CORDÃO"));
        when(productDefinitionService.list()).thenReturn(definitions);

        mockMvc.perform(get("/product-definitions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("BRINCO"))
                .andExpect(jsonPath("$[1].name").value("CORDÃO"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listDetailed_returnsDefinitionsWithCount() throws Exception {
        var definitions = List.of(
                new ProductDefinitionListDTO(1L, "BRINCO", 5L),
                new ProductDefinitionListDTO(2L, "CORDÃO", 0L));
        when(productDefinitionService.listWithCount()).thenReturn(definitions);

        mockMvc.perform(get("/product-definitions/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("BRINCO"))
                .andExpect(jsonPath("$[0].productCount").value(5))
                .andExpect(jsonPath("$[1].productCount").value(0));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_returnsCreated() throws Exception {
        var created = new ProductDefinitionDTO(1L, "ANEL");
        when(productDefinitionService.create(any())).thenReturn(created);

        mockMvc.perform(post("/product-definitions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"ANEL\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("ANEL"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_returnsUpdated() throws Exception {
        var updated = new ProductDefinitionDTO(1L, "BRINCO GRANDE");
        when(productDefinitionService.update(eq(1L), any())).thenReturn(updated);

        mockMvc.perform(patch("/product-definitions/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"BRINCO GRANDE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("BRINCO GRANDE"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_returnsNotFound_whenMissing() throws Exception {
        doThrow(new ResponseStatusException(NOT_FOUND))
                .when(productDefinitionService).update(eq(99L), any());

        mockMvc.perform(patch("/product-definitions/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"X\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returnsNoContent() throws Exception {
        doNothing().when(productDefinitionService).delete(1L);

        mockMvc.perform(delete("/product-definitions/1").with(csrf()))
                .andExpect(status().isNoContent());

        verify(productDefinitionService).delete(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returnsNotFound_whenMissing() throws Exception {
        doThrow(new ResponseStatusException(NOT_FOUND))
                .when(productDefinitionService).delete(99L);

        mockMvc.perform(delete("/product-definitions/99").with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returnsConflict_whenProductsLinked() throws Exception {
        doThrow(new ResponseStatusException(CONFLICT, "Produtos vinculados"))
                .when(productDefinitionService).delete(1L);

        mockMvc.perform(delete("/product-definitions/1").with(csrf()))
                .andExpect(status().isConflict());
    }
}
