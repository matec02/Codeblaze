package com.projektr.codeblaze.domain;

public enum InvoicePaymentMethod {
    PAYPAL("PAYPAL","PayPal"),
    KEKSPAY("KEKSPAY", "KeksPay"),
    REVOLUT("REVOLUT", "Revolut");

    private final String code;
    private final String displayValue;

    InvoicePaymentMethod(String code, String displayValue) {
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
