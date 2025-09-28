package com.e_commerce.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Product {

    private Long id;
    private String name;
    private String description;
    private int stock;
    private double price;
}
