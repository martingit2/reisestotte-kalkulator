// Fil: src/main/java/com/example/backend/model/TravelClaim.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data // Lombok-magi: Lager gettere, settere, toString, etc. automatisk
@Entity // Forteller Spring at dette er en tabell-modell (en "entitet")
@Table(name = "travel_claims") // Spesifiserer tabellnavnet i databasen
public class TravelClaim {

    @Id // Dette er primærnøkkelen
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Lar databasen sette ID-en automatisk
    private Long id;

    private String startAddress;
    private String destinationAddress;
    private BigDecimal distanceKm; // BigDecimal er best for penger og presise desimaler
    private String transportMode;
    private BigDecimal calculatedSupport;

    @Column(updatable = false) // Sørger for at dette feltet ikke kan endres etter det er satt
    private LocalDateTime createdAt;

    @PrePersist // Kjører denne metoden rett før objektet lagres for første gang
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}