package com.example.salesheet.repositories;

import com.example.salesheet.dto.SpreadSheetPageDTO;
import com.example.salesheet.entities.SpreadSheet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public interface SpreadsheetRepositoryCustom {
    SpreadSheetPageDTO findAllWithCounts(Specification<SpreadSheet> listSpec, UUID userId, Pageable pageable);
}
