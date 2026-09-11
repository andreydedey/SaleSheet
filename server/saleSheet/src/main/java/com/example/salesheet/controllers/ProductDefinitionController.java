package com.example.salesheet.controllers;

import com.example.salesheet.dto.ProductDefinitionDTO;
import com.example.salesheet.dto.ProductDefinitionListDTO;
import com.example.salesheet.services.ProductDefinitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-definitions")
@RequiredArgsConstructor
public class ProductDefinitionController {

    private final ProductDefinitionService productDefinitionService;

    @GetMapping
    @PreAuthorize("hasRole('SALESPERSON')")
    public List<ProductDefinitionDTO> list() {
        return productDefinitionService.list();
    }

    @GetMapping("/detailed")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductDefinitionListDTO> listDetailed() {
        return productDefinitionService.listWithCount();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDefinitionDTO> create(@RequestBody ProductDefinitionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productDefinitionService.create(dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDefinitionDTO> update(@PathVariable Long id, @RequestBody ProductDefinitionDTO dto) {
        return ResponseEntity.ok(productDefinitionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productDefinitionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
