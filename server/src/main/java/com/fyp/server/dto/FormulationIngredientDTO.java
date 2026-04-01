package com.fyp.server.dto;

import lombok.Data;

@Data
public class FormulationIngredientDTO {
    private String name;
    private String recommended_concentration;
    private String role_in_product;
    private String reason;
    private String caution;
}
