package com.projektr.codeblaze.domain;

public enum TransactionStatus {

    //ne treba se pratiti tijek transakcije nego ih samo spremiti kad iznajmljivanje završi
    //SUCCESSFUL("SUCCESSFUL", "Successful"),
    //UNSUCCESSFUL("UNSUCCESSFUL", "Unsuccessful"),
    //IN_PROGRESS("IN_PROGRESS", "In Progress");

    //gledamo je li iznajmljivac vidio transakciju i ocijenio klijenta ili ne
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

