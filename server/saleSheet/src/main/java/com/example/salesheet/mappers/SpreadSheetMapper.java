package com.example.salesheet.mappers;

import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;

public class SpreadSheetMapper {

    public static SpreadSheetDTO toDTO(SpreadSheet entity) {
        SpreadSheetDTO dto = new SpreadSheetDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setIssuedAt(entity.getIssuedAt());
        dto.setStatus(entity.getStatus().name());
        if (entity.getUser() != null) {
            dto.setSalespersonId(entity.getUser().getId());
            dto.setSalespersonName(entity.getUser().getName());
        }
        return dto;
    }
}
