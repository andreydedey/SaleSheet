package com.example.salesheet.specifications;

import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class SpreadSheetSpecifications {

    public static Specification<SpreadSheet> hasUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<SpreadSheet> hasStatus(SpreadSheetStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<SpreadSheet> isNotDraft() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), SpreadSheetStatus.DRAFT);
    }

    public static Specification<SpreadSheet> nameContains(String name) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<SpreadSheet> buildSpec(UUID salespersonId, SpreadSheetStatus status, String name) {
        return buildSpec(salespersonId, status, name, false);
    }

    public static Specification<SpreadSheet> buildSpec(UUID salespersonId, SpreadSheetStatus status, String name, boolean excludeDraft) {
        Specification<SpreadSheet> spec = (root, query, cb) -> cb.conjunction();

        if (excludeDraft) {
            spec = spec.and(isNotDraft());
        }
        if (salespersonId != null) {
            spec = spec.and(hasUser(salespersonId));
        }
        if (status != null) {
            spec = spec.and(hasStatus(status));
        }
        if (name != null) {
            spec = spec.and(nameContains(name));
        }

        return spec;
    }
}
