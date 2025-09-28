package com.e_commerce.order_service.controller;

import com.e_commerce.order_service.model.Product;
import com.e_commerce.order_service.service.ProductClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final ProductClientService productClientService;

    @GetMapping("/")
    public ResponseEntity<List<Product>> getProductsForOrder() {
        List<Product> products = productClientService.getProducts();

        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }
}
