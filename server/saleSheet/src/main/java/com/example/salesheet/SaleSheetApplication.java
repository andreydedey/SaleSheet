package com.example.salesheet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SaleSheetApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaleSheetApplication.class, args);
    }

}
