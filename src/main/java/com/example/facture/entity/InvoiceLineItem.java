package com.example.facture.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoice_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double quantity;
    private Double unitPrice;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;
}
