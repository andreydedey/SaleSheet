package com.example.salesheet.services;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.entities.Product;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock SpreadsheetRepository spreadsheetRepository;
    @InjectMocks ProductService productService;

    private Product buildProduct(Long id, Long spreadsheetId) {
        var spreadsheet = new SpreadSheet();
        spreadsheet.setId(spreadsheetId);
        var product = new Product();
        product.setId(id);
        product.setReference("REF-001");
        product.setDefinition("Blusa Floral");
        product.setPrice(100L);
        product.setSpreadSheet(spreadsheet);
        return product;
    }

    @Test
    void addProduct_throwsNotFound_whenSpreadsheetMissing() {
        when(spreadsheetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.addProduct(99L, new ProductDTO()))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void addProduct_savesAndReturnsDTO() {
        var spreadsheet = new SpreadSheet();
        spreadsheet.setId(1L);
        var product = buildProduct(1L, 1L);

        when(spreadsheetRepository.findById(1L)).thenReturn(Optional.of(spreadsheet));
        when(productRepository.save(any())).thenReturn(product);

        var dto = new ProductDTO();
        dto.setReference("REF-001");
        dto.setDefinition("Blusa Floral");
        dto.setPrice(100L);

        var result = productService.addProduct(1L, dto);

        assertThat(result.getReference()).isEqualTo("REF-001");
        assertThat(result.getDefinition()).isEqualTo("Blusa Floral");
        verify(productRepository).save(any());
    }

    @Test
    void updateProduct_throwsNotFound_whenProductMissing() {
        when(productRepository.findByIdAndSpreadSheetId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct(1L, 5L, new ProductDTO()))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void updateProduct_updatesFieldsAndReturnsDTO() {
        var product = buildProduct(1L, 1L);
        when(productRepository.findByIdAndSpreadSheetId(1L, 1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenReturn(product);

        var dto = new ProductDTO();
        dto.setReference("REF-NEW");
        dto.setDefinition("Updated");
        dto.setPrice(200L);
        dto.setObservation("note");

        var result = productService.updateProduct(1L, 1L, dto);

        // updateProduct sets reference, price, definition, observation — not sold
        assertThat(product.getReference()).isEqualTo("REF-NEW");
        assertThat(product.getDefinition()).isEqualTo("Updated");
        assertThat(product.getPrice()).isEqualTo(200L);
        assertThat(product.getObservation()).isEqualTo("note");
        assertThat(result).isNotNull();
    }

    @Test
    void deleteProduct_throwsNotFound_whenProductMissing() {
        when(productRepository.findByIdAndSpreadSheetId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct(1L, 5L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void deleteProduct_deletesProduct() {
        var product = buildProduct(1L, 1L);
        when(productRepository.findByIdAndSpreadSheetId(1L, 1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L, 1L);

        verify(productRepository).delete(product);
    }

    @Test
    void markSold_throwsNotFound_whenProductMissing() {
        when(productRepository.findByIdAndSpreadSheetId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.markSold(1L, 5L, true))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void markSold_updatesAndReturnsDTO() {
        var product = buildProduct(1L, 1L);
        when(productRepository.findByIdAndSpreadSheetId(1L, 1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenReturn(product);

        productService.markSold(1L, 1L, true);

        assertThat(product.isSold()).isTrue();
        verify(productRepository).save(product);
    }

    @Test
    void markSold_unsold_setsFieldToFalse() {
        var product = buildProduct(1L, 1L);
        product.setSold(true);
        when(productRepository.findByIdAndSpreadSheetId(1L, 1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenReturn(product);

        productService.markSold(1L, 1L, false);

        assertThat(product.isSold()).isFalse();
        verify(productRepository).save(product);
    }

    @Test
    void addNote_throwsNotFound_whenProductMissing() {
        when(productRepository.findByIdAndSpreadSheetId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.addNote(1L, 5L, "note"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode").isEqualTo(NOT_FOUND);
    }

    @Test
    void addNote_setsObservationAndReturnsDTO() {
        var product = buildProduct(1L, 1L);
        when(productRepository.findByIdAndSpreadSheetId(1L, 1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any())).thenReturn(product);

        productService.addNote(1L, 1L, "aguardando pagamento");

        assertThat(product.getObservation()).isEqualTo("aguardando pagamento");
        verify(productRepository).save(product);
    }
}
