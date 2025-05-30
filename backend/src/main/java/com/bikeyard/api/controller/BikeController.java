package com.bikeyard.api.controller;

import com.bikeyard.api.model.Bike;
import com.bikeyard.api.service.BikeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    @Autowired
    private BikeService bikeService;

    @GetMapping
    public List<Bike> getAllBikes() {
        return bikeService.getAllBikes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable Long id) {
        return bikeService.getBikeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public List<Bike> getBikesByType(@PathVariable String type) {
        return bikeService.getBikesByType(type);
    }

    @GetMapping("/brand/{brand}")
    public List<Bike> getBikesByBrand(@PathVariable String brand) {
        return bikeService.getBikesByBrand(brand);
    }

    @GetMapping("/available")
    public List<Bike> getAvailableBikes() {
        return bikeService.getAvailableBikes();
    }

    @GetMapping("/price")
    public List<Bike> getBikesByMaxPrice(@RequestParam Double maxPrice) {
        return bikeService.getBikesByMaxPrice(maxPrice);
    }

    @PostMapping
    public ResponseEntity<Bike> createBike(@Valid @RequestBody Bike bike) {
        Bike createdBike = bikeService.createBike(bike);
        return ResponseEntity.ok(createdBike);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bike> updateBike(
            @PathVariable Long id,
            @Valid @RequestBody Bike bikeDetails) {
        return bikeService.updateBike(id, bikeDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable Long id) {
        return bikeService.deleteBike(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
} 