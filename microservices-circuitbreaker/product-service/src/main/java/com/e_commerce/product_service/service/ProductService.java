package com.e_commerce.product_service.service;

import com.e_commerce.product_service.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    public List<Product> getProducts() {
        return List.of(
                new Product(1L, "Product 1", "Description 1", 10, 100.0),
                new Product(2L, "Product 2", "Description 2", 20, 200.0),
                new Product(3L, "Product 3", "Description 3", 30, 300.0)
        );
    }
}
