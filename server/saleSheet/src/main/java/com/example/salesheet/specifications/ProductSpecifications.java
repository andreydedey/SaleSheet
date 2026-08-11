package com.example.salesheet.specifications;

import com.example.salesheet.entities.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {

    public static Specification<Product> hasSpreadSheet(Long spreadsheetId) {
        return (root, query, cb) -> cb.equal(root.get("spreadSheet").get("id"), spreadsheetId);
    }

    public static Specification<Product> isSold(boolean sold) {
        return (root, query, cb) -> cb.equal(root.get("sold"), sold);
    }

    public static Specification<Product> build(Long spreadsheetId, Boolean sold) {
        Specification<Product> spec = hasSpreadSheet(spreadsheetId);
        if (sold != null) {
            spec = spec.and(isSold(sold));
        }
        return spec;
    }
}
