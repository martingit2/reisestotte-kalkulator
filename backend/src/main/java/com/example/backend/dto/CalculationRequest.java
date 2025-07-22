package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class CalculationRequest {
    @NotBlank(message = "Startadresse kan ikke være tom")
    private String startAddress;

    @NotBlank(message = "Destinasjon kan ikke være tom")
    private String destinationAddress;

    @NotNull(message = "Reiselengde må være angitt")
    @Positive(message = "Reiselengde må være et positivt tall")
    private BigDecimal distanceKm;

    @NotBlank(message = "Transportmiddel må være valgt")
    private String transportMode;
}