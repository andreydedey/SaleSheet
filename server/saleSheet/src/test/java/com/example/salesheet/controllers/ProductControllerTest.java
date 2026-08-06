package com.example.salesheet.controllers;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.services.CustomOAuth2UserService;
import com.example.salesheet.security.OAuth2LoginSuccessHandler;
import com.example.salesheet.services.ProductService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean ProductService productService;
    @MockitoBean CustomOAuth2UserService customOAuth2UserService;
    @MockitoBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProducts_returnsPageOfProducts() throws Exception {
        var product = new ProductDTO(1L, "REF-001", 100L, "Blusa", false, null);
        var page = new PageImpl<>(List.of(product), PageRequest.of(0, 20), 1);
        when(productService.getProducts(eq(1L), any())).thenReturn(page);

        mockMvc.perform(get("/spreadsheets/1/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].reference").value("REF-001"))
                .andExpect(jsonPath("$.content[0].definition").value("Blusa"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addProduct_returnsCreated() throws Exception {
        var dto = new ProductDTO(null, "REF-002", 150L, "Calça", false, null);
        var saved = new ProductDTO(2L, "REF-002", 150L, "Calça", false, null);
        when(productService.addProduct(eq(1L), any())).thenReturn(saved);

        mockMvc.perform(post("/spreadsheets/1/items")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.reference").value("REF-002"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_returnsNoContent() throws Exception {
        doNothing().when(productService).deleteProduct(1L, 3L);

        mockMvc.perform(delete("/spreadsheets/1/items/3").with(csrf()))
                .andExpect(status().isNoContent());

        verify(productService).deleteProduct(1L, 3L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_returnsNotFound_whenProductMissing() throws Exception {
        doThrow(new ResponseStatusException(NOT_FOUND))
                .when(productService).deleteProduct(1L, 99L);

        mockMvc.perform(delete("/spreadsheets/1/items/99").with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void markSold_returnsUpdatedProduct() throws Exception {
        var updated = new ProductDTO(1L, "REF-001", 100L, "Blusa", true, null);
        when(productService.markSold(eq(1L), eq(1L), eq(true))).thenReturn(updated);

        mockMvc.perform(patch("/spreadsheets/1/items/1/sold")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sold\": true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sold").value(true));
    }

}
