// Fil: src/main/java/com/example/backend/repository/TravelClaimRepository.java
package com.example.backend.repository;

import com.example.backend.model.TravelClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Markerer dette som en Spring-komponent for database-tilgang
public interface TravelClaimRepository extends JpaRepository<TravelClaim, Long> {

    // Spring forstår dette navnet og lager automatisk en spørring som
    // henter de 5 nyeste radene, sortert etter ID i synkende rekkefølge. Magi!
    List<TravelClaim> findTop5ByOrderByIdDesc();
}