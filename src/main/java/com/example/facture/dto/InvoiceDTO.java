package com.example.facture.dto;

import java.util.List;

public class InvoiceDTO {
    private String clientName;
    private String invoiceDate;
    private String invoiceType;
    private Double totalAmount;
    private Double tva;
    private List<LineItemDTO> lineItems;
    private String extractedText; // <-- to send extracted OCR text

    // Getters & Setters
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(String invoiceDate) { this.invoiceDate = invoiceDate; }

    public String getInvoiceType() { return invoiceType; }
    public void setInvoiceType(String invoiceType) { this.invoiceType = invoiceType; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getTva() { return tva; }
    public void setTva(Double tva) { this.tva = tva; }

    public List<LineItemDTO> getLineItems() { return lineItems; }
    public void setLineItems(List<LineItemDTO> lineItems) { this.lineItems = lineItems; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
}
