package com.example.salesheet.mappers;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.entities.Product;
import com.example.salesheet.entities.SpreadSheet;

public class ProductMapper {

    public static ProductDTO toDTO(Product entity) {
        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setReference(entity.getReference());
        dto.setPrice(entity.getPrice());
        dto.setDefinition(entity.getDefinition());
        dto.setSold(entity.isSold());
        dto.setObservation(entity.getObservation());
        return dto;
    }

    public static Product toEntity(ProductDTO dto, SpreadSheet spreadSheet) {
        Product product = new Product();
        product.setReference(dto.getReference());
        product.setPrice(dto.getPrice());
        product.setDefinition(dto.getDefinition());
        product.setSold(dto.getSold() != null && dto.getSold());
        product.setObservation(dto.getObservation());
        product.setSpreadSheet(spreadSheet);
        return product;
    }
}
