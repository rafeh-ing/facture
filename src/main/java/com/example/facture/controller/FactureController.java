package com.example.facture.controller;

import com.example.facture.dto.InvoiceDTO;
import com.example.facture.dto.LineItemDTO;
import com.example.facture.entity.Invoice;
import com.example.facture.service.DocumentAIService;
import com.example.facture.service.InvoiceParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/facture")
public class FactureController {

    private final DocumentAIService documentAIService;
    private final InvoiceParserService invoiceParserService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeFacture(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("📥 Received file: " + file.getOriginalFilename());

            // 1. OCR
            byte[] bytes = file.getBytes();
            String extractedText = documentAIService.processInvoice(bytes, file.getContentType());

            System.out.println("✅ OCR completed");
            System.out.println("🧠 Extracted text:\n" + extractedText);

            // 2. Parse & save
            Invoice invoice = invoiceParserService.parseAndSaveInvoice(extractedText);

            // 3. Map Entity → DTO
            InvoiceDTO dto = new InvoiceDTO();
            dto.setClientName(invoice.getClientName());
            dto.setInvoiceDate(invoice.getInvoiceDate().toString());
            dto.setInvoiceType(invoice.getInvoiceType());
            dto.setTotalAmount(invoice.getTotalAmount());
            dto.setTva(invoice.getTva());
            dto.setExtractedText(extractedText);

            dto.setLineItems(invoice.getLineItems().stream().map(lineItem -> {
                LineItemDTO li = new LineItemDTO();
                li.setProduct(lineItem.getDescription());
                li.setQuantity(lineItem.getQuantity());
                li.setPrice(lineItem.getUnitPrice());
                return li;
            }).collect(Collectors.toList()));

            // 4. Return DTO (no recursion issue)
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            System.err.println("❌ Error during invoice analysis:");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }
}
