package com.example.salesheet.services;

import com.example.salesheet.dto.SalespersonStatsDTO;
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

        var result = spreadsheetRepository.findAllWithCounts(spec, userId, Pageable.unpaged());

        long totalPieces = result.content().stream().mapToLong(s -> s.getTotalPieces()).sum();
        long totalSoldPieces = result.content().stream().mapToLong(s -> s.getSoldPieces()).sum();
        long totalSold = result.content().stream().mapToLong(s -> s.getTotalSold()).sum();

        return new SalespersonStatsDTO(totalSold, totalPieces, totalSoldPieces, (int) result.totalCount());
    }
}
