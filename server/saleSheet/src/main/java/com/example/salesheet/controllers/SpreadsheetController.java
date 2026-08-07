package com.example.salesheet.controllers;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.dto.UpdateSalespersonDTO;
import com.example.salesheet.dto.UpdateStatusDTO;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.services.SpreadsheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/spreadsheets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SpreadsheetController {

    private final SpreadsheetService spreadsheetService;

    @GetMapping
    public Page<SpreadSheetListDTO> list(
            @RequestParam(required = false) UUID salespersonId,
            @RequestParam(required = false) SpreadSheetStatus status,
            @RequestParam(required = false) String name,
            Pageable pageable) {
        return spreadsheetService.list(salespersonId, status, name, pageable);
    }

    @PostMapping
    public ResponseEntity<SpreadSheetDTO> create(@RequestBody SpreadSheetCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spreadsheetService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpreadSheetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(spreadsheetService.getById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SpreadSheetDTO> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return ResponseEntity.ok(spreadsheetService.updateStatus(id, dto.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spreadsheetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/emit")
    public ResponseEntity<SpreadSheetDTO> emit(@PathVariable Long id) {
        return ResponseEntity.ok(spreadsheetService.emit(id));
    }

    @PatchMapping("/{id}/salesperson")
    public ResponseEntity<SpreadSheetDTO> updateSalesperson(
            @PathVariable Long id,
            @RequestBody UpdateSalespersonDTO dto) {
        return ResponseEntity.ok(spreadsheetService.updateSalesperson(id, dto.salespersonId()));
    }
}
