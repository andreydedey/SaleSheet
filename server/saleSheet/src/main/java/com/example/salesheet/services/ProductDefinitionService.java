package com.example.salesheet.services;

import com.example.salesheet.dto.ProductDefinitionDTO;
import com.example.salesheet.dto.ProductDefinitionListDTO;
import com.example.salesheet.entities.ProductDefinition;
import com.example.salesheet.repositories.ProductDefinitionRepository;
import com.example.salesheet.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductDefinitionService {

    private final ProductDefinitionRepository productDefinitionRepository;
    private final ProductRepository productRepository;

    public List<ProductDefinitionDTO> list() {
        return productDefinitionRepository.findAllDefinitions();
    }

    public List<ProductDefinitionListDTO> listWithCount() {
        return productDefinitionRepository.findAllWithProductCount();
    }

    public ProductDefinitionDTO create(ProductDefinitionDTO dto) {
        var entity = new ProductDefinition();
        entity.setName(dto.name());
        entity = productDefinitionRepository.save(entity);
        return new ProductDefinitionDTO(entity.getId(), entity.getName());
    }

    public ProductDefinitionDTO update(Long id, ProductDefinitionDTO dto) {
        var entity = productDefinitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Definition not found"));
        entity.setName(dto.name());
        entity = productDefinitionRepository.save(entity);
        return new ProductDefinitionDTO(entity.getId(), entity.getName());
    }

    public void delete(Long id) {
        var entity = productDefinitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Definition not found"));
        long count = productRepository.countByDefinitionId(id);
        if (count > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir esta definição pois existem " + count + " produtos vinculados a ela.");
        }
        productDefinitionRepository.delete(entity);
    }
}
