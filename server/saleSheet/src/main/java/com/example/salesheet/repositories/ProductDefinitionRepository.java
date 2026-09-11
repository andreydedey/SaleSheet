package com.example.salesheet.repositories;

import com.example.salesheet.dto.ProductDefinitionDTO;
import com.example.salesheet.dto.ProductDefinitionListDTO;
import com.example.salesheet.entities.ProductDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDefinitionRepository extends JpaRepository<ProductDefinition, Long> {

    @Query("SELECT new com.example.salesheet.dto.ProductDefinitionDTO(d.id, d.name) FROM ProductDefinition d ORDER BY d.name")
    List<ProductDefinitionDTO> findAllDefinitions();

    @Query("SELECT new com.example.salesheet.dto.ProductDefinitionListDTO(d.id, d.name, COUNT(p.id)) FROM ProductDefinition d LEFT JOIN Product p ON p.definition = d GROUP BY d.id, d.name ORDER BY d.name")
    List<ProductDefinitionListDTO> findAllWithProductCount();
}
