package com.projektr.codeblaze.domain;

public enum ListingStatus {
    ACTIVE("ACTIVE", "Active"),
    FINISHED("FINISHED", "Finished"),
    CANCELLED("CANCELLED", "Cancelled");

    private final String code;
    private final String displayValue;

    ListingStatus(String code, String displayValue) {
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
