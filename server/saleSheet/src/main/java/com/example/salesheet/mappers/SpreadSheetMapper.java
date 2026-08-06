package com.example.salesheet.mappers;

import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.entities.SpreadSheet;

public class SpreadSheetMapper {

    public static SpreadSheetDTO toDTO(SpreadSheet entity) {
        SpreadSheetDTO dto = new SpreadSheetDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setIssuedAt(entity.getIssuedAt());
        dto.setStatus(entity.getStatus().name());
        return dto;
    }

    public static SpreadSheetListDTO toListDTO(SpreadSheet entity) {
        SpreadSheetListDTO dto = new SpreadSheetListDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setIssuedAt(entity.getIssuedAt());
        dto.setStatus(entity.getStatus().name());

        int totalPieces = entity.getProducts().size();
        int soldPieces = (int) entity.getProducts().stream().filter(p -> p.isSold()).count();

        dto.setTotalPieces(totalPieces);
        dto.setSoldPieces(soldPieces);
        return dto;
    }
}
