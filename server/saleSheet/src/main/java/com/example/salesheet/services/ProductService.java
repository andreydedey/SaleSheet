package com.example.salesheet.services;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.dto.ProductPageDTO;
import com.example.salesheet.mappers.ProductMapper;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.specifications.ProductSpecifications;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SpreadsheetRepository spreadsheetRepository;

    @Transactional(readOnly = true)
    public ProductPageDTO getProducts(Long spreadsheetId, Boolean sold, Pageable pageable) {
        var listSpec = ProductSpecifications.build(spreadsheetId, sold);
        var sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE,
                Sort.by("id").ascending()
        );
        var page = productRepository.findAll(listSpec, sortedPageable).map(ProductMapper::toDTO);

        Map<Boolean, Long> countsMap = new HashMap<>();
        productRepository.countGroupBySold(spreadsheetId)
                .forEach(row -> countsMap.put((Boolean) row[0], (Long) row[1]));

        long soldCount = countsMap.getOrDefault(true, 0L);
        long unsoldCount = countsMap.getOrDefault(false, 0L);
        long totalCount = soldCount + unsoldCount;

        return new ProductPageDTO(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize(),
                totalCount,
                soldCount,
                unsoldCount
        );
    }

    public ProductDTO addProduct(Long spreadsheetId, ProductDTO dto) {
        var spreadSheet = spreadsheetRepository.findById(spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        var product = ProductMapper.toEntity(dto, spreadSheet);
        product = productRepository.save(product);
        log.info("Product added: id={}, reference={}, spreadsheetId={}", product.getId(), product.getReference(), spreadsheetId);
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
        log.info("Product deleted: id={}, spreadsheetId={}", productId, spreadsheetId);
    }

    public ProductDTO markSold(Long spreadsheetId, Long productId, boolean sold) {
        var product = productRepository.findByIdAndSpreadSheetId(productId, spreadsheetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        product.setSold(sold);
        product = productRepository.save(product);
        log.info("Product marked {}: id={}, spreadsheetId={}", sold ? "sold" : "unsold", productId, spreadsheetId);
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
