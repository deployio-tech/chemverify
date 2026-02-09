package com.fyp.server.entity;

import lombok.Getter;

@Getter
public enum UserRole {
    USER("USER"),
    DERMATOLOGIST("DERMATOLOGIST"),
    ADMIN("ADMIN");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }
}
