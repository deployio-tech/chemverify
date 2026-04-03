package com.fyp.server.dto;

import lombok.Data;
import java.util.List;
import com.fyp.server.dto.PatientProfileDTO;
import com.fyp.server.dto.FormulationIngredientDTO;

@Data
public class RecommendationResponseDTO {
    private String product_type;
    private String product_name_suggestion;
    private String formulation_type;
    private String target_pH;
    private String shelf_life_estimate;
    private PatientProfileDTO patient_profile;
    private List<FormulationIngredientDTO> formulation;
    private String application_instructions;
    private String climate_considerations;
    private String formulation_notes;
}

