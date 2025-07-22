package com.example.backend.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CalculationResponse {
    private BigDecimal calculatedSupport;
    private String message;
}