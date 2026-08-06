package com.example.salesheet.repositories;

import com.example.salesheet.dto.SpreadSheetListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.salesheet.entities.SpreadSheet;

public interface SpreadsheetRepositoryCustom {
    Page<SpreadSheetListDTO> findAllAsListDTO(Specification<SpreadSheet> spec, Pageable pageable);
}
