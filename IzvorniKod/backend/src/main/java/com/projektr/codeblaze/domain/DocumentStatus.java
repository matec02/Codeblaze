package com.projektr.codeblaze.domain;

public enum DocumentStatus {
    PENDING("PENDING", "Pending"),
    APPROVED("APPROVED", "Approved"),
    REJECTED("REJECTED", "Rejected");

    private final String code;
    private final String displayValue;

    DocumentStatus(String code, String displayValue) {
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

