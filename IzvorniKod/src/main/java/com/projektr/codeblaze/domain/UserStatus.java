package com.projektr.codeblaze.domain;

public enum UserStatus {
    PENDING("PENDING", "Pending"),
    REJECTED("REJECTED", "Rejected"),
    ACCEPTED("ACCEPTED", "Accepted"),
    BLOCKED("BLOCKED", "Blocked");

    private final String code;
    private final String displayValue;

    UserStatus(String code, String displayValue) {
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