package com.example.salesheet.services;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.mappers.ProductMapper;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SpreadsheetRepository spreadsheetRepository;

    public Page<ProductDTO> getProducts(Long spreadsheetId, Pageable pageable) {
        return productRepository.findProductsBySpreadSheetId(spreadsheetId, pageable);
    }

    public ProductDTO addProduct(Long spreadsheetId, ProductDTO dto) {
        var spreadSheet = spreadsheetRepository.findById(spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        var product = ProductMapper.toEntity(dto, spreadSheet);
        product = productRepository.save(product);
        return ProductMapper.toDTO(product);
    }

    public ProductDTO updateProduct(Long spreadsheetId, Long productId, ProductDTO dto) {
        var product = productRepository.findByIdAndSpreadSheetId(productId, spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        product.setReference(dto.getReference());
        product.setPrice(dto.getPrice());
        product.setDefinition(dto.getDefinition());
        product.setObservation(dto.getObservation());

        product = productRepository.save(product);
        return ProductMapper.toDTO(product);
    }

    public void deleteProduct(Long spreadsheetId, Long productId) {
        var product = productRepository.findByIdAndSpreadSheetId(productId, spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        productRepository.delete(product);
    }

    public ProductDTO markSold(Long spreadsheetId, Long productId, boolean sold) {
        var product = productRepository.findByIdAndSpreadSheetId(productId, spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        product.setSold(sold);
        product = productRepository.save(product);
        return ProductMapper.toDTO(product);
    }

    public ProductDTO addNote(Long spreadsheetId, Long productId, String observation) {
        var product = productRepository.findByIdAndSpreadSheetId(productId, spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        boolean clearing = observation == null || observation.isBlank();
        product.setObservation(clearing ? null : observation);
        product.setObservationUpdatedAt(clearing ? null : LocalDateTime.now());
        product = productRepository.save(product);
        return ProductMapper.toDTO(product);
    }
}
