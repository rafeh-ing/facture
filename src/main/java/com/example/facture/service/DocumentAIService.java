package com.example.facture.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class DocumentAIService {

    private static final String TESSDATA_PATH = "C:/Program Files/Tesseract-OCR/tessdata";
    private static final String LANGUAGES = "eng+fra";
    


    public String processInvoice(byte[] fileBytes, String mimeType) throws IOException {
        if ("application/pdf".equalsIgnoreCase(mimeType)) {
            return processPdf(fileBytes);
        } else {
            return processImage(fileBytes, mimeType);
        }
    }

    private String processPdf(byte[] fileBytes) throws IOException {
        StringBuilder extractedText = new StringBuilder();

        try (PDDocument document = PDDocument.load(fileBytes)) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            Tesseract tesseract = getTesseractInstance();

            for (int page = 0; page < document.getNumberOfPages(); page++) {
                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300);

                // Création d'un fichier temporaire pour passer à Tesseract
                File tempImage = File.createTempFile("page-" + page + "-", ".png");
                ImageIO.write(bim, "png", tempImage);

                try {
                    String result = tesseract.doOCR(tempImage);
                    extractedText.append(result).append("\n\n");
                } catch (TesseractException e) {
                    throw new RuntimeException("Erreur OCR sur la page " + page + ": " + e.getMessage());
                } finally {
                    tempImage.delete();
                }
            }
        }
        return extractedText.toString();
    }

    private String processImage(byte[] fileBytes, String mimeType) throws IOException {
        File tempFile = File.createTempFile("facture-", "." + getExtensionFromMimeType(mimeType));
        java.nio.file.Files.write(tempFile.toPath(), fileBytes);

        Tesseract tesseract = getTesseractInstance();

        try {
            return tesseract.doOCR(tempFile);
        } catch (TesseractException e) {
            throw new RuntimeException("Erreur OCR image: " + e.getMessage());
        } finally {
            tempFile.delete();
        }
    }

    private Tesseract getTesseractInstance() {
    Tesseract tesseract = new Tesseract();
    tesseract.setDatapath(TESSDATA_PATH);  // Doit pointer vers le dossier 'tessdata'
    tesseract.setLanguage(LANGUAGES);
    return tesseract;
}

    private String getExtensionFromMimeType(String mimeType) {
        if (mimeType == null) return "png";
        switch (mimeType) {
            case "image/jpeg": return "jpg";
            case "image/png": return "png";
            case "application/pdf": return "pdf";
            default: return "png";
        }
    }
}
