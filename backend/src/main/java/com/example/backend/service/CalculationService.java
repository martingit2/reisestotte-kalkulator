package com.example.backend.service;

import com.example.backend.dto.CalculationRequest;
import com.example.backend.model.TravelClaim;
import com.example.backend.repository.TravelClaimRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class CalculationService {

    private final TravelClaimRepository travelClaimRepository;

    public CalculationService(TravelClaimRepository travelClaimRepository) {
        this.travelClaimRepository = travelClaimRepository;
    }

    public BigDecimal calculateSupport(CalculationRequest request) {
        // Forenklet forretningslogikk for demonstrasjon
        final BigDecimal RATE_PER_KM = new BigDecimal("3.00");
        final BigDecimal DEDUCTIBLE = new BigDecimal("171.00");
        final BigDecimal MIN_DISTANCE_KM = new BigDecimal("10.0");

        if (request.getDistanceKm().compareTo(MIN_DISTANCE_KM) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalCost = request.getDistanceKm().multiply(RATE_PER_KM);
        BigDecimal support = totalCost.subtract(DEDUCTIBLE);

        return support.max(BigDecimal.ZERO);
    }

    public TravelClaim saveCalculation(CalculationRequest request, BigDecimal support) {
        TravelClaim claim = new TravelClaim();
        claim.setStartAddress(request.getStartAddress());
        claim.setDestinationAddress(request.getDestinationAddress());
        claim.setDistanceKm(request.getDistanceKm());
        claim.setTransportMode(request.getTransportMode());
        claim.setCalculatedSupport(support);

        return travelClaimRepository.save(claim);
    }
}