package com.example.salesheet.services;

import com.example.salesheet.dto.ProductDefinitionDTO;
import com.example.salesheet.dto.ProductDefinitionListDTO;
import com.example.salesheet.entities.ProductDefinition;
import com.example.salesheet.repositories.ProductDefinitionRepository;
import com.example.salesheet.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class ProductDefinitionServiceTest {

    @Mock ProductDefinitionRepository productDefinitionRepository;
    @Mock ProductRepository productRepository;
    @InjectMocks ProductDefinitionService productDefinitionService;

    private ProductDefinition buildEntity(Long id, String name) {
        var entity = new ProductDefinition();
        entity.setId(id);
        entity.setName(name);
        return entity;
    }

    @Test
    void list_returnsDTOs() {
        var dtos = List.of(new ProductDefinitionDTO(1L, "BRINCO"), new ProductDefinitionDTO(2L, "CORDÃO"));
        when(productDefinitionRepository.findAllDefinitions()).thenReturn(dtos);

        var result = productDefinitionService.list();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).name()).isEqualTo("BRINCO");
    }

    @Test
    void listWithCount_returnsDTOsWithProductCount() {
        var dtos = List.of(
                new ProductDefinitionListDTO(1L, "BRINCO", 5L),
                new ProductDefinitionListDTO(2L, "CORDÃO", 0L));
        when(productDefinitionRepository.findAllWithProductCount()).thenReturn(dtos);

        var result = productDefinitionService.listWithCount();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).productCount()).isEqualTo(5L);
        assertThat(result.get(1).productCount()).isEqualTo(0L);
    }

    @Test
    void create_savesAndReturnsDTO() {
        var entity = buildEntity(1L, "ANEL");
        when(productDefinitionRepository.save(any())).thenReturn(entity);

        var result = productDefinitionService.create(new ProductDefinitionDTO(null, "ANEL"));

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("ANEL");
        verify(productDefinitionRepository).save(any());
    }

    @Test
    void update_updatesNameAndReturnsDTO() {
        var entity = buildEntity(1L, "BRINCO");
        when(productDefinitionRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productDefinitionRepository.save(any())).thenReturn(entity);

        var result = productDefinitionService.update(1L, new ProductDefinitionDTO(null, "BRINCO GRANDE"));

        assertThat(entity.getName()).isEqualTo("BRINCO GRANDE");
        assertThat(result.name()).isEqualTo("BRINCO GRANDE");
        verify(productDefinitionRepository).save(entity);
    }

    @Test
    void update_throwsNotFound_whenMissing() {
        when(productDefinitionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productDefinitionService.update(99L, new ProductDefinitionDTO(null, "X")))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void delete_deletesEntity() {
        var entity = buildEntity(1L, "BRINCO");
        when(productDefinitionRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productRepository.countByDefinitionId(1L)).thenReturn(0L);

        productDefinitionService.delete(1L);

        verify(productDefinitionRepository).delete(entity);
    }

    @Test
    void delete_throwsNotFound_whenMissing() {
        when(productDefinitionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productDefinitionService.delete(99L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void delete_throwsConflict_whenProductsLinked() {
        var entity = buildEntity(1L, "BRINCO");
        when(productDefinitionRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productRepository.countByDefinitionId(1L)).thenReturn(3L);

        assertThatThrownBy(() -> productDefinitionService.delete(1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(CONFLICT);

        verify(productDefinitionRepository, never()).delete(any());
    }
}
