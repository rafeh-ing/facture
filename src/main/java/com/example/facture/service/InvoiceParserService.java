package com.example.facture.service;

import com.example.facture.Repositoty.InvoiceRepository;
import com.example.facture.entity.Invoice;
import com.example.facture.entity.InvoiceLineItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class InvoiceParserService {

    private final InvoiceRepository invoiceRepository;

    public Invoice parseAndSaveInvoice(String extractedText) {
        if (extractedText == null) extractedText = "";
        String cleanText = extractedText.replaceAll("\\r", "").trim();

        Invoice invoice = new Invoice();

        // Extract fields
        invoice.setClientName(extractClientName(cleanText));
        invoice.setInvoiceType(classifyInvoiceType(cleanText));
        invoice.setInvoiceDate(extractInvoiceDate(cleanText));

        // Extract line items
        List<InvoiceLineItem> lineItems = extractLineItems(cleanText);
        for (InvoiceLineItem item : lineItems) {
            item.setInvoice(invoice);
        }
        invoice.setLineItems(lineItems);

        // Extract total and TVA
        invoice.setTotalAmount(extractTotalAmount(cleanText, lineItems));
        invoice.setTva(extractTVA(cleanText));

        return invoiceRepository.save(invoice);
    }

    private String classifyInvoiceType(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("estimate")) return "Estimate";
        if (lower.contains("receipt")) return "Receipt";
        if (lower.contains("invoice")) return "Invoice";
        // Fallback: if it has "Total" and line items, likely an invoice
        if (lower.contains("total")) return "Invoice";
        return "Unknown";
    }

    private String extractClientName(String text) {
        // Matches "Billed to: <name>" possibly on next line
        Pattern pattern = Pattern.compile("Billed to\\s*:?\\s*(.+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            String name = matcher.group(1).trim();
            // Stop at first line break if name is multi-line
            if (name.contains("\n")) {
                name = name.substring(0, name.indexOf("\n")).trim();
            }
            return name.isEmpty() ? "Unknown Client" : name;
        }
        return "Unknown Client";
    }

    private String extractInvoiceDate(String text) {
        // Match "02 June, 2030" or "02/06/2030" or "02-06-2030"
        Pattern pattern = Pattern.compile(
                "(\\d{1,2}\\s+[A-Za-z]+,\\s*\\d{4})|(\\d{1,2}[/-]\\d{1,2}[/-]\\d{4})"
        );
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group().trim();
        }
        return "Unknown Date";
    }

    private Double extractTVA(String text) {
        Pattern pattern = Pattern.compile("TVA\\s*:?\\s*(\\d+[\\.,]?\\d*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1).replace(",", "."));
            } catch (NumberFormatException ignored) {
            }
        }
        return 0.0;
    }

    private Double extractTotalAmount(String text, List<InvoiceLineItem> items) {
        Pattern pattern = Pattern.compile("Total\\s*\\$?(\\d+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1));
            } catch (NumberFormatException ignored) {
            }
        }
        // Fallback to sum of line items
        return items.stream().mapToDouble(InvoiceLineItem::getTotal).sum();
    }

    private List<InvoiceLineItem> extractLineItems(String text) {
        List<InvoiceLineItem> lineItems = new ArrayList<>();

        /*
         * Matches:
         * Logo 1 $500 $500
         * Banner (2x6m) 2 $45 $90
         * Poster (1x2m) 3 $55 $165
         */
        Pattern pattern = Pattern.compile(
                "([A-Za-z0-9()\\-\\s]+?)\\s+(\\d+)\\s*\\$?(\\d+(?:\\.\\d{1,2})?)\\s*\\$?(\\d+(?:\\.\\d{1,2})?)"
        );
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            try {
                String product = matcher.group(1).trim();
                double quantity = Double.parseDouble(matcher.group(2));
                double unitPrice = Double.parseDouble(matcher.group(3));
                double total = Double.parseDouble(matcher.group(4));

                InvoiceLineItem item = new InvoiceLineItem();
                item.setDescription(product);
                item.setQuantity(quantity);
                item.setUnitPrice(unitPrice);
                item.setTotal(total);

                lineItems.add(item);
            } catch (Exception ignored) {
            }
        }

        return lineItems;
    }
}
