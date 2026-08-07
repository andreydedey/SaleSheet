package com.example.salesheet.dto;

import com.example.salesheet.enums.SpreadSheetStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpreadSheetListDTO {
    private Long id;
    private String name;
    private String salespersonName;
    private LocalDateTime issuedAt;
    private long totalPieces;
    private long soldPieces;
    private long totalSold;
    private SpreadSheetStatus status;
}
