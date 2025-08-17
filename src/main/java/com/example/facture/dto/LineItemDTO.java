package com.example.facture.dto;

public class LineItemDTO {
    private String product;
    private Double quantity;
    private Double price;

    // Getters & Setters
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
