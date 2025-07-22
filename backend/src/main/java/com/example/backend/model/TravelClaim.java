// Fil: src/main/java/com/example/backend/model/TravelClaim.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data 
@Entity 
@Table(name = "travel_claims") 
public class TravelClaim {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String startAddress;
    private String destinationAddress;
    private BigDecimal distanceKm; // BigDecimal er best for penger og presise desimaler
    private String transportMode;
    private BigDecimal calculatedSupport;

    @Column(updatable = false) 
    private LocalDateTime createdAt;

    @PrePersist // Kjører denne metoden rett før objektet lagres for første gang
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}