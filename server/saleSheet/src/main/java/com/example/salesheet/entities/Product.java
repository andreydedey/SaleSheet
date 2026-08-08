package com.example.salesheet.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;

    private String definition;

    private Long price;

    private boolean sold = false;

    private String observation;

    private LocalDateTime observationUpdatedAt;

    @ManyToOne
    private SpreadSheet spreadSheet;
}
