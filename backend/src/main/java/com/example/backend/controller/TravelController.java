package com.example.backend.controller;

import com.example.backend.dto.CalculationRequest;
import com.example.backend.dto.CalculationResponse;
import com.example.backend.model.TravelClaim;
import com.example.backend.repository.TravelClaimRepository;
import com.example.backend.service.CalculationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class TravelController {

    private static final Logger log = LoggerFactory.getLogger(TravelController.class);

    private final CalculationService calculationService;
    private final TravelClaimRepository travelClaimRepository;

    public TravelController(CalculationService calculationService, TravelClaimRepository travelClaimRepository) {
        this.calculationService = calculationService;
        this.travelClaimRepository = travelClaimRepository;
    }

    @PostMapping("/calculate-support")
    public ResponseEntity<CalculationResponse> calculateSupport(@Valid @RequestBody CalculationRequest request) {
        log.info("Mottatt forespørsel for beregning: {}", request);
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

    @GetMapping("/search-address")
    public ResponseEntity<String> searchAddress(@RequestParam String q) {
        String baseUrl = "https://nominatim.openstreetmap.org/search";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("q", q)
                .queryParam("format", "json")
                .queryParam("countrycodes", "no")
                .queryParam("limit", 5);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Reisestotte-Kalkulator/1.0 (Student Project)");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            return restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class
            );
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("{\"error\": \"Kunne ikke hente adressedata: " + e.getMessage() + "\"}");
        }
    }
}