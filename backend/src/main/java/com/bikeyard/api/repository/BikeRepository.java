package com.bikeyard.api.repository;

import com.bikeyard.api.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByType(String type);
    List<Bike> findByBrand(String brand);
    List<Bike> findByAvailable(Boolean available);
    List<Bike> findByPriceLessThanEqual(Double maxPrice);
    List<Bike> findByTypeAndAvailable(String type, Boolean available);
    List<Bike> findByBrandAndAvailable(String brand, Boolean available);
} 