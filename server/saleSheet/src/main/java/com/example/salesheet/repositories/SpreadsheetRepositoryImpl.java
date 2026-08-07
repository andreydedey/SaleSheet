package com.example.salesheet.repositories;

import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.entities.Product;
import com.example.salesheet.entities.SpreadSheet;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class SpreadsheetRepositoryImpl implements SpreadsheetRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<SpreadSheetListDTO> findAllAsListDTO(Specification<SpreadSheet> spec, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        CriteriaQuery<SpreadSheetListDTO> query = cb.createQuery(SpreadSheetListDTO.class);
        Root<SpreadSheet> root = query.from(SpreadSheet.class);
        Join<SpreadSheet, Product> productJoin = root.join("products", JoinType.LEFT);

        query.select(cb.construct(
                SpreadSheetListDTO.class,
                root.get("id"),
                root.get("name"),
                root.get("issuedAt"),
                cb.count(productJoin.get("id")),
                cb.sum(cb.<Long>selectCase()
                        .when(cb.isTrue(productJoin.get("sold")), 1L)
                        .otherwise(0L)
                ),
                cb.sum(cb.<Long>selectCase()
                        .when(cb.isTrue(productJoin.get("sold")), productJoin.<Long>get("price"))
                        .otherwise(0L)
                ),
                root.get("status")
        ));

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, query, cb);
            if (predicate != null) {
                query.where(predicate);
            }
        }

        query.groupBy(root.get("id"));

        if (pageable.getSort().isSorted()) {
            List<Order> orders = pageable.getSort().stream()
                    .map(order -> order.isAscending()
                            ? cb.asc(root.get(order.getProperty()))
                            : cb.desc(root.get(order.getProperty())))
                    .toList();
            query.orderBy(orders);
        }

        List<SpreadSheetListDTO> results = em.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<SpreadSheet> countRoot = countQuery.from(SpreadSheet.class);
        countQuery.select(cb.count(countRoot));

        if (spec != null) {
            Predicate countPredicate = spec.toPredicate(countRoot, countQuery, cb);
            if (countPredicate != null) {
                countQuery.where(countPredicate);
            }
        }

        long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(results, pageable, total);
    }
}
