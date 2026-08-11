package com.example.salesheet.dto;

import java.util.List;

public record ProductPageDTO(
        List<ProductDTO> content,
        long totalElements,
        int totalPages,
        int number,
        int size,
        long totalCount,
        long soldCount,
        long unsoldCount
) {}
