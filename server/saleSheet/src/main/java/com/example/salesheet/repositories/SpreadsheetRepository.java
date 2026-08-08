package com.example.salesheet.repositories;

import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SpreadsheetRepository extends JpaRepository<SpreadSheet, Long>, SpreadsheetRepositoryCustom {
    long countByStatus(SpreadSheetStatus status);
    long countByUserIdAndStatusNot(UUID userId, SpreadSheetStatus status);
    void deleteAllByUserId(UUID userId);
}
