package com.projektr.codeblaze.domain;

public enum ListingStatus {

    AVAILABLE("AVAILABLE", "Available"), //prikazuje se na pocetnoj, po defaultu i ako se odbije zahtjev
    REQUESTED("REQUESTED", "Requested"), //ne prikazuje se na pocetnoj, bit ce ujedno i delete
    RENTED("RENTED", "Rented"), //prikazuje klijentu ako iznajmljivac prihvati
    RETURNED("RETURNED", "Returned"); //ne prikazuje se nigdje

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
