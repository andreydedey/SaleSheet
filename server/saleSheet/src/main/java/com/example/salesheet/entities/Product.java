package com.example.salesheet.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @ManyToOne
    private SpreadSheet spreadSheet;
}
