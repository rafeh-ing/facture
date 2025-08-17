package com.example.facture.Repositoty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.facture.entity.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {}
