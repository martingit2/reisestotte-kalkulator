package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

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

    @NotNull(message = "Alder må oppgis")
    @Min(value = 0, message = "Alder kan ikke være negativ")
    private Integer age;

    @NotNull
    private Boolean hasFrikort;
}