package com.example.salesheet.services;

import com.example.salesheet.dto.SalespersonStatsDTO;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.specifications.SpreadSheetSpecifications;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SalespersonService {

    private final SpreadsheetRepository spreadsheetRepository;

    @Transactional(readOnly = true)
    public SalespersonStatsDTO getStats(UUID userId) {
        var spec = SpreadSheetSpecifications.hasUser(userId)
                .and(SpreadSheetSpecifications.isNotDraft());

        var spreadsheets = spreadsheetRepository.findAllAsListDTO(spec, Pageable.unpaged());

        long totalPieces = spreadsheets.getContent().stream().mapToLong(s -> s.getTotalPieces()).sum();
        long totalSoldPieces = spreadsheets.getContent().stream().mapToLong(s -> s.getSoldPieces()).sum();
        long totalSold = 0; // Price sum would need a separate query

        return new SalespersonStatsDTO(totalSold, totalPieces, totalSoldPieces, spreadsheets.getContent().size());
    }
}
