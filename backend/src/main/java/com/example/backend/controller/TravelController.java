package com.example.backend.controller;

import com.example.backend.dto.CalculationRequest;
import com.example.backend.dto.CalculationResponse;
import com.example.backend.model.TravelClaim;
import com.example.backend.repository.TravelClaimRepository;
import com.example.backend.service.CalculationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class TravelController {

    private final CalculationService calculationService;
    private final TravelClaimRepository travelClaimRepository;

    public TravelController(CalculationService calculationService, TravelClaimRepository travelClaimRepository) {
        this.calculationService = calculationService;
        this.travelClaimRepository = travelClaimRepository;
    }

    @PostMapping("/calculate-support")
    public ResponseEntity<CalculationResponse> calculateSupport(@Valid @RequestBody CalculationRequest request) {
        BigDecimal support = calculationService.calculateSupport(request);
        calculationService.saveCalculation(request, support);

        String message = "Beregning fullført.";
        CalculationResponse response = new CalculationResponse(support, message);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<TravelClaim>> getHistory() {
        List<TravelClaim> history = travelClaimRepository.findTop5ByOrderByIdDesc();
        return ResponseEntity.ok(history);
    }
}