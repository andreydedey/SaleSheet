package com.example.salesheet.dto;

import java.util.List;

public record SpreadSheetPageDTO(
        List<SpreadSheetListDTO> content,
        long totalElements,
        int totalPages,
        int number,
        int size,
        long totalCount,
        long activeCount,
        long inactiveCount
) {}
