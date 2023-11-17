package com.projektr.codeblaze.domain;

public enum UserRole {
    ADMIN("ADMIN", "Administrator"),
    USER("USER", "User"),
    GUEST("GUEST", "Guest"),
    RENTER("RENTER", "Renter");

    private final String code;
    private final String displayValue;

    UserRole(String code, String displayValue) {
        this.code = code;
        this.displayValue = displayValue;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayValue() {
        return displayValue;
    }
}
