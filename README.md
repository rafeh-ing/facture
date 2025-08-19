#  Invoice Analyzer App

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Tesseract OCR](https://img.shields.io/badge/Tesseract-OCR-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A smart, AI-powered invoice parser and analyzer for businesses. Extracts line items, totals, tax, detects anomalies, and organizes your invoices effortlessly.**

---

##  Features

- **OCR-powered text extraction** – Supports PDFs and images.
- **Line Item Extraction** – Automatically detects products, quantities, unit prices, and totals.
- **Invoice Classification** – Detects if it’s an Invoice, Receipt, or Estimate.
- **Anomaly Detection** – Flags missing tax (TVA), incorrect totals, or suspicious entries.
- **Dashboard Summaries** – Total invoices, top clients, and visual summaries.
- **Database Storage** – Save structured invoices for future reference.
- **Secure & Local** – All processing can run locally, no sensitive data leaves your machine.

---

##  Tech Stack

- **Backend:** Java + Spring Boot  
- **OCR:** Tesseract (open-source)  
- **Database:** MySQL / PostgreSQL  
- **Frontend:** (if applicable, React/Thymeleaf, etc.)  
- **Other:** Lombok, Regex for smart parsing  

---

##  How It Works

1. Upload PDF or image invoice.  
2. OCR extracts raw text.  
3. `InvoiceParserService` uses regex to extract client name, date, line items, totals, and tax.  
4. Anomalies are detected and flagged.  
5. Structured invoice saved in DB for easy querying and reporting.  

---


##  Installation

```bash
# Clone the repo
git clone https://github.com/rafeh-ing/facture.git

# Enter project directory
cd facture

# Run backend
./mvnw spring-boot:run
