package com.example.salesheet.controllers;

import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SalespersonStatsDTO;
import com.example.salesheet.security.CustomUserPrincipal;
import com.example.salesheet.services.SalespersonService;
import com.example.salesheet.services.SpreadsheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/salesperson")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SALESPERSON')")
public class SalespersonController {

    private final SpreadsheetService spreadsheetService;
    private final SalespersonService salespersonService;

    @GetMapping("/spreadsheets/{id}")
    public ResponseEntity<SpreadSheetDTO> getSpreadsheet(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(spreadsheetService.getByIdForUser(id, principal.getUser().getId()));
    }

    @GetMapping("/stats")
    public ResponseEntity<SalespersonStatsDTO> getStats(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(salespersonService.getStats(principal.getUser().getId()));
    }
}
