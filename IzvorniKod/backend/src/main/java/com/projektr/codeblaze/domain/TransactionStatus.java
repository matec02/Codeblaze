package com.projektr.codeblaze.domain;

public enum TransactionStatus {
    SUCCESSFUL("SUCCESSFUL", "Successful"),
    UNSUCCESSFUL("UNSUCCESSFUL", "Unsuccessful"),
    IN_PROGRESS("IN_PROGRESS", "In Progress");

    private final String code;
    private final String displayValue;

    TransactionStatus(String code, String displayValue) {
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

