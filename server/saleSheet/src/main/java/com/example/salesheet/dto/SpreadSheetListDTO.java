package com.example.salesheet.dto;

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
    private LocalDateTime issuedAt;
    private int totalPieces;
    private int soldPieces;
    private String status;
}
