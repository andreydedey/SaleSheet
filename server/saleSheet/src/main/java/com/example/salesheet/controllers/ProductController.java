package com.example.salesheet.controllers;

import com.example.salesheet.dto.AddNoteDTO;
import com.example.salesheet.dto.MarkSoldDTO;
import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spreadsheets/{spreadsheetId}/items")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductDTO> getProducts(@PathVariable Long spreadsheetId, Pageable pageable) {
        return productService.getProducts(spreadsheetId, pageable);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> addProduct(@PathVariable Long spreadsheetId, @RequestBody ProductDTO dto) {
        var product = productService.addProduct(spreadsheetId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PatchMapping("/{itemId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long spreadsheetId,
            @PathVariable Long itemId,
            @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(spreadsheetId, itemId, dto));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long spreadsheetId, @PathVariable Long itemId) {
        productService.deleteProduct(spreadsheetId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{itemId}/sold")
    public ResponseEntity<ProductDTO> markSold(
            @PathVariable Long spreadsheetId,
            @PathVariable Long itemId,
            @RequestBody MarkSoldDTO dto) {
        return ResponseEntity.ok(productService.markSold(spreadsheetId, itemId, dto.sold()));
    }

    @PatchMapping("/{itemId}/note")
    public ResponseEntity<ProductDTO> addNote(
            @PathVariable Long spreadsheetId,
            @PathVariable Long itemId,
            @RequestBody AddNoteDTO dto) {
        return ResponseEntity.ok(productService.addNote(spreadsheetId, itemId, dto.observation()));
    }
}
