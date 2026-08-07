package com.example.salesheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalespersonStatsDTO {
    private long totalSold;
    private long totalPieces;
    private long totalSoldPieces;
    private int totalSpreadsheets;
}
