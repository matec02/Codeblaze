package com.projektr.codeblaze.domain;

public enum PreferenceUserLanguage {
    ENG("ENG", "English"),
    CRO("CRO", "Croatian");

    private final String code;
    private final String displayValue;

    PreferenceUserLanguage(String code, String displayValue) {
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
