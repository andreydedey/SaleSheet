package com.example.salesheet.repositories;

import com.example.salesheet.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findByIdAndSpreadSheetId(Long id, Long spreadSheetId);

    long countBySpreadSheetId(Long spreadSheetId);

    @Query("SELECT COALESCE(SUM(p.price), 0) FROM Product p WHERE p.sold = true")
    long sumSoldPrices();

    @Query("""
            SELECT p.sold, COUNT(p)
            FROM Product p
            WHERE p.spreadSheet.id = :spreadsheetId
            GROUP BY p.sold
            """)
    List<Object[]> countGroupBySold(@Param("spreadsheetId") Long spreadsheetId);

    long countByDefinitionId(Long definitionId);
}
