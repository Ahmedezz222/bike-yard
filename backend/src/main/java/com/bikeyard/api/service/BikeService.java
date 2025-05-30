package com.bikeyard.api.service;

import com.bikeyard.api.model.Bike;
import com.bikeyard.api.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BikeService {
    
    @Autowired
    private BikeRepository bikeRepository;

    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    public Optional<Bike> getBikeById(Long id) {
        return bikeRepository.findById(id);
    }

    public List<Bike> getBikesByType(String type) {
        return bikeRepository.findByType(type);
    }

    public List<Bike> getBikesByBrand(String brand) {
        return bikeRepository.findByBrand(brand);
    }

    public List<Bike> getAvailableBikes() {
        return bikeRepository.findByAvailable(true);
    }

    public List<Bike> getBikesByMaxPrice(Double maxPrice) {
        return bikeRepository.findByPriceLessThanEqual(maxPrice);
    }

    public Bike createBike(Bike bike) {
        return bikeRepository.save(bike);
    }

    public Optional<Bike> updateBike(Long id, Bike bikeDetails) {
        return bikeRepository.findById(id)
            .map(existingBike -> {
                existingBike.setBrand(bikeDetails.getBrand());
                existingBike.setModel(bikeDetails.getModel());
                existingBike.setType(bikeDetails.getType());
                existingBike.setSize(bikeDetails.getSize());
                existingBike.setColor(bikeDetails.getColor());
                existingBike.setPrice(bikeDetails.getPrice());
                existingBike.setCondition(bikeDetails.getCondition());
                existingBike.setDescription(bikeDetails.getDescription());
                existingBike.setAvailable(bikeDetails.getAvailable());
                return bikeRepository.save(existingBike);
            });
    }

    public boolean deleteBike(Long id) {
        return bikeRepository.findById(id)
            .map(bike -> {
                bikeRepository.delete(bike);
                return true;
            })
            .orElse(false);
    }
} 