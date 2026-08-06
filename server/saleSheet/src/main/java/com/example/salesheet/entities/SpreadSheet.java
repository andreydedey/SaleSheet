package com.example.salesheet.entities;

import com.example.salesheet.enums.SpreadSheetStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "spreadsheets")
@Getter
@Setter
public class SpreadSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String name;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private SpreadSheetStatus status = SpreadSheetStatus.DRAFT;

    @OneToMany(mappedBy = "spreadSheet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime issuedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
