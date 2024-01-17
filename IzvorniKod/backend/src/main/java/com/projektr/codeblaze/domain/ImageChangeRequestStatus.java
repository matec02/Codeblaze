package com.projektr.codeblaze.domain;

public enum ImageChangeRequestStatus {
    APPROVED("APPROVED", "Approved"),
    REJECTED("REJECTED", "Rejected"),
    PENDING("PENDING", "Pending"),
    REQUESTED("REQUESTED", "Requested");

    private final String code;
    private final String displayValue;

    ImageChangeRequestStatus(String code, String displayValue) {
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
