package com.example.salesheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpreadSheetDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime issuedAt;
    private String status;
}
