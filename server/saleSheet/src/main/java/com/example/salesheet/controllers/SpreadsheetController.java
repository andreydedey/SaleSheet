package com.example.salesheet.controllers;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetPageDTO;
import com.example.salesheet.dto.UpdateSalespersonDTO;
import com.example.salesheet.dto.UpdateStatusDTO;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.security.CustomUserPrincipal;
import com.example.salesheet.services.SpreadsheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/spreadsheets")
@RequiredArgsConstructor
public class SpreadsheetController {

    private final SpreadsheetService spreadsheetService;

    @GetMapping
    @PreAuthorize("hasRole('SALESPERSON')")
    public SpreadSheetPageDTO list(
            @RequestParam(required = false) UUID salespersonId,
            @RequestParam(required = false) SpreadSheetStatus status,
            @RequestParam(required = false) String name,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        boolean isSalesperson = principal.getUser().getRole() == Role.SALESPERSON;
        UUID effectiveUserId = isSalesperson ? principal.getUser().getId() : salespersonId;
        return spreadsheetService.list(effectiveUserId, status, name, isSalesperson, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpreadSheetDTO> create(@RequestBody SpreadSheetCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spreadsheetService.create(dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpreadSheetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(spreadsheetService.getById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpreadSheetDTO> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return ResponseEntity.ok(spreadsheetService.updateStatus(id, dto.status()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spreadsheetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/emit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpreadSheetDTO> emit(@PathVariable Long id) {
        return ResponseEntity.ok(spreadsheetService.emit(id));
    }

    @PatchMapping("/{id}/salesperson")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpreadSheetDTO> updateSalesperson(
            @PathVariable Long id,
            @RequestBody UpdateSalespersonDTO dto) {
        return ResponseEntity.ok(spreadsheetService.updateSalesperson(id, dto.salespersonId()));
    }
}
