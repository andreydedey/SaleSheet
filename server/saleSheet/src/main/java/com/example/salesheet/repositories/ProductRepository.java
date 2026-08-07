package com.example.salesheet.repositories;

import com.example.salesheet.dto.ProductDTO;
import com.example.salesheet.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT new com.example.salesheet.dto.ProductDTO(
                p.id, p.reference, p.price, p.definition, p.sold, p.observation
            )
            FROM Product p
            WHERE p.spreadSheet.id = :spreadSheetId
            ORDER BY p.id ASC
            """)
    Page<ProductDTO> findProductsBySpreadSheetId(Long spreadSheetId, Pageable pageable);

    Optional<Product> findByIdAndSpreadSheetId(Long id, Long spreadSheetId);

    long countBySpreadSheetId(Long spreadSheetId);
}
