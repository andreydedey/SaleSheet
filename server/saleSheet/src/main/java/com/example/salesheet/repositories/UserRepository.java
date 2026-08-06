package com.example.salesheet.repositories;

import com.example.salesheet.dto.SalespersonDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByOauthSubject(String oauthSubject);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    @Query("""
            SELECT new com.example.salesheet.dto.SalespersonDTO(
                u.id, u.name, u.email,
                COALESCE(SUM(CASE WHEN p.sold = true THEN p.price ELSE 0 END), 0),
                CAST(COUNT(DISTINCT s.id) AS int)
            )
            FROM User u
            LEFT JOIN SpreadSheet s ON s.user = u
            LEFT JOIN Product p ON p.spreadSheet = s
            WHERE u.role = com.example.salesheet.enums.Role.SALESPERSON
            GROUP BY u.id
            """)
    Page<SalespersonDTO> findAllSalespersonStats(Pageable pageable);
}
