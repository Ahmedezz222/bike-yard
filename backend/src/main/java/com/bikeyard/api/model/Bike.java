package com.bikeyard.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bikes")
public class Bike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Brand is required")
    @Size(min = 2, max = 50, message = "Brand must be between 2 and 50 characters")
    @Column(nullable = false)
    private String brand;

    @NotBlank(message = "Model is required")
    @Size(min = 2, max = 50, message = "Model must be between 2 and 50 characters")
    @Column(nullable = false)
    private String model;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(Mountain|Road|Hybrid|Electric|BMX|Kids)$", 
             message = "Type must be one of: Mountain, Road, Hybrid, Electric, BMX, Kids")
    @Column(nullable = false)
    private String type;

    @NotBlank(message = "Size is required")
    @Pattern(regexp = "^(XS|S|M|L|XL|XXL|[0-9]{2,3}cm)$", 
             message = "Size must be either XS, S, M, L, XL, XXL or a number in cm")
    @Column(nullable = false)
    private String size;

    @NotBlank(message = "Color is required")
    @Size(min = 2, max = 30, message = "Color must be between 2 and 30 characters")
    @Column(nullable = false)
    private String color;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @DecimalMax(value = "100000.0", message = "Price must be less than 100,000")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Condition is required")
    @Pattern(regexp = "^(New|Used|Refurbished)$", 
             message = "Condition must be one of: New, Used, Refurbished")
    @Column(nullable = false)
    private String condition;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    @NotNull(message = "Availability status is required")
    @Column(nullable = false)
    private Boolean available = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 