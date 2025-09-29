package com.e_commerce.order_service.service;

import com.e_commerce.order_service.model.Product;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ProductClientService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PRODUCT_SERVICE_URL = "http://localhost:8080/";

    @CircuitBreaker(name = "productService", fallbackMethod = "getProductsFallback")
    public List<Product> getProducts() {
        Product[] products = restTemplate.getForObject(PRODUCT_SERVICE_URL, Product[].class);

        // Creating immutable list for safety
        return List.of(products != null ? products : new Product[0]);
    }

    public List<Product> getProductsFallback(Exception e) {
        return List.of(
                new Product(0L, "Default Product", "This is a default product due to service unavailability", 0, 0.0)
        );
    }
}
