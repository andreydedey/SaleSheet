package com.example.salesheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String reference;
    private Long price;
    private String definition;
    private Boolean sold;
    private String observation;
    private LocalDateTime observationUpdatedAt;
}
