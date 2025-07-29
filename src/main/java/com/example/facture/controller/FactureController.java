package com.example.facture.controller;

import com.example.facture.service.DocumentAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/facture")
public class FactureController {

    @Autowired
    private DocumentAIService documentAIService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> analyzeFacture(@RequestParam("file") MultipartFile file) {
        try {
            // ✅ Debug info
            System.out.println("📥 Received file: " + file.getOriginalFilename());
            System.out.println("📦 MIME type: " + file.getContentType());
            System.out.println("📏 Size: " + file.getSize() + " bytes");

            // Convert to byte array
            byte[] bytes = file.getBytes();

            // Call service
            String extractedText = documentAIService.processInvoice(bytes, file.getContentType());

            // Log result
            System.out.println("✅ OCR completed successfully");
            System.out.println("🧠 Extracted text:\n" + extractedText);

            return ResponseEntity.ok(extractedText);

        } catch (Exception e) {
            System.err.println("❌ Exception during invoice analysis:");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'analyse de la facture: " + e.getMessage());
        }
    }
}
