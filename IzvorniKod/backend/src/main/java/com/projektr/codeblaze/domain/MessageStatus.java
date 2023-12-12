package com.projektr.codeblaze.domain;

public enum MessageStatus {
    READ("READ", "Read"),
    UNREAD("UNREAD", "Unread");

    private final String code;
    private final String displayValue;

    MessageStatus(String code, String displayValue) {
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

