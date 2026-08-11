package com.example.salesheet.repositories;

import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.dto.SpreadSheetPageDTO;
import com.example.salesheet.entities.Product;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.SpreadSheetStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class SpreadsheetRepositoryImpl implements SpreadsheetRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public SpreadSheetPageDTO findAllWithCounts(Specification<SpreadSheet> listSpec, UUID userId, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // --- Main list query ---
        CriteriaQuery<SpreadSheetListDTO> query = cb.createQuery(SpreadSheetListDTO.class);
        Root<SpreadSheet> root = query.from(SpreadSheet.class);
        Join<SpreadSheet, Product> productJoin = root.join("products", JoinType.LEFT);
        Join<SpreadSheet, User> userJoin = root.join("user", JoinType.LEFT);

        query.select(cb.construct(
                SpreadSheetListDTO.class,
                root.get("id"),
                root.get("name"),
                userJoin.get("name"),
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

        if (listSpec != null) {
            Predicate predicate = listSpec.toPredicate(root, query, cb);
            if (predicate != null) query.where(predicate);
        }

        query.groupBy(root.get("id"), userJoin.get("id"), userJoin.get("name"));

        if (pageable.getSort().isSorted()) {
            List<Order> orders = pageable.getSort().stream()
                    .map(order -> order.isAscending()
                            ? cb.asc(root.get(order.getProperty()))
                            : cb.desc(root.get(order.getProperty())))
                    .toList();
            query.orderBy(orders);
        }

        var typedQuery = em.createQuery(query);
        if (pageable.isPaged()) {
            typedQuery.setFirstResult((int) pageable.getOffset())
                      .setMaxResults(pageable.getPageSize());
        }
        List<SpreadSheetListDTO> results = typedQuery.getResultList();

        // --- Pagination count ---
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<SpreadSheet> countRoot = countQuery.from(SpreadSheet.class);
        countQuery.select(cb.countDistinct(countRoot));

        if (listSpec != null) {
            Predicate countPredicate = listSpec.toPredicate(countRoot, countQuery, cb);
            if (countPredicate != null) countQuery.where(countPredicate);
        }

        long total = em.createQuery(countQuery).getSingleResult();

        // --- Status counts (single GROUP BY query, non-draft only) ---
        CriteriaQuery<Object[]> statusCountQuery = cb.createQuery(Object[].class);
        Root<SpreadSheet> scRoot = statusCountQuery.from(SpreadSheet.class);
        Predicate notDraft = cb.notEqual(scRoot.get("status"), SpreadSheetStatus.DRAFT);
        Predicate statusCountPredicate = userId != null
                ? cb.and(cb.equal(scRoot.get("user").get("id"), userId), notDraft)
                : notDraft;
        statusCountQuery
                .multiselect(scRoot.get("status"), cb.count(scRoot))
                .where(statusCountPredicate)
                .groupBy(scRoot.get("status"));

        Map<SpreadSheetStatus, Long> countsMap = new HashMap<>();
        em.createQuery(statusCountQuery).getResultList()
                .forEach(row -> countsMap.put((SpreadSheetStatus) row[0], (Long) row[1]));

        long totalCount = countsMap.values().stream().mapToLong(Long::longValue).sum();
        long activeCount = countsMap.getOrDefault(SpreadSheetStatus.ACTIVE, 0L);
        long inactiveCount = countsMap.getOrDefault(SpreadSheetStatus.INACTIVE, 0L);

        int pageSize = pageable.isPaged() ? pageable.getPageSize() : results.size();
        int totalPages = pageSize > 0 ? (int) Math.ceil((double) total / pageSize) : 1;
        int pageNumber = pageable.isPaged() ? pageable.getPageNumber() : 0;

        return new SpreadSheetPageDTO(results, total, totalPages, pageNumber, pageSize,
                totalCount, activeCount, inactiveCount);
    }
}
