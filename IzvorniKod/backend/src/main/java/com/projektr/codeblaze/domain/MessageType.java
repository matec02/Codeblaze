package com.projektr.codeblaze.domain;

import lombok.Getter;

@Getter
public enum MessageType {
    REGULAR("REGULAR", "Regular Message"),
    REQUEST("REQUEST", "Request Message"),
    ACTION("ACTION", "Action Message");

    private final String code;
    private final String displayValue;

    MessageType(String code, String displayValue) {
        this.code = code;
        this.displayValue = displayValue;
    }

}