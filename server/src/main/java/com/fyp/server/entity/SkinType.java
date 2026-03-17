package com.fyp.server.entity;

public enum SkinType {
    OILY,
    DRY,
    COMBINATION,
    SENSITIVE,
    NORMAL,
    ACNE_PRONE;

    /**
     * Parse a skin type string, handling hyphens (e.g. "Acne-Prone" → ACNE_PRONE).
     */
    public static SkinType fromString(String value) {
        if (value == null || value.isBlank()) {
            return NORMAL;
        }
        // Replace hyphens with underscores so "ACNE-PRONE" becomes "ACNE_PRONE"
        String normalized = value.trim().toUpperCase().replace("-", "_");
        return SkinType.valueOf(normalized);
    }
}
