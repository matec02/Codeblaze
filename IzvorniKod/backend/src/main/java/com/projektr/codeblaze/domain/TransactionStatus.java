package com.projektr.codeblaze.domain;

public enum TransactionStatus {


    SEEN("SEEN", "Seen"),
    UNSEEN("UNSEEN", "Unseen");

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

