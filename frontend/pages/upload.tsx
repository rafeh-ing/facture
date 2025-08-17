import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

type LineItem = {
  id?: number;
  product: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id?: number;
  clientName?: string;
  invoiceType?: string;
  invoiceDate?: string;
  totalAmount?: number;
  tva?: number;
  lineItems: LineItem[];
  extractedText?: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError("");
      setInvoice(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(0);
    setError("");
    setInvoice(null);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 10;
          clearInterval(interval);
          return prev;
        });
      }, 200);

      const res = await fetch("http://localhost:9090/api/facture/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await res.json();
      setProgress(100);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-blue-400">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <button className="text-left hover:text-blue-300">Import CSV</button>
          <button className="text-left hover:text-blue-300">Create Report</button>
          <button className="text-left hover:text-blue-300">Prediction</button>
          <button className="text-left hover:text-blue-300">Audit Log</button>
          <button className="text-left hover:text-blue-300">External Reports</button>
        </nav>
        <div className="mt-auto text-sm text-gray-400">Jean Dupont</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-gray-800 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Smart Data Analysis Application</h1>

        {/* Upload section */}
        <div className="bg-gray-700 p-6 rounded-lg mb-8 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-semibold text-blue-400 mb-4"
          >
            Import a CSV or Invoice file
          </motion.h2>

          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {file && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-2 text-sm text-gray-300"
            >
              Selected file: <span className="text-blue-300 font-semibold">{file.name}</span>
            </motion.p>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mb-4 animate-pulse"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 px-6 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </motion.button>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md mt-2"
              >
                <div className="h-4 w-full bg-gray-600 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    className="h-full bg-blue-500"
                  />
                </div>
                <p className="text-center text-sm text-blue-300 mt-1">{progress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Display parsed invoice */}
          {invoice && (
            <div className="mt-6 flex flex-col gap-6 bg-gray-600 p-4 rounded-lg max-h-[600px] overflow-auto text-sm">
              {/* Image Preview */}
              {file && file.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-64 h-auto rounded shadow-lg border border-gray-400"
                />
              )}

              {/* Parsed Invoice Details */}
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-blue-400">Parsed Invoice Details</h3>
                <p><strong>Client Name:</strong> {invoice.clientName || "-"}</p>
                <p><strong>Invoice Type:</strong> {invoice.invoiceType || "-"}</p>
                <p><strong>Invoice Date:</strong> {invoice.invoiceDate || "-"}</p>
                <p><strong>Total Amount:</strong> {invoice.totalAmount ?? "-"}</p>
                <p><strong>TVA:</strong> {invoice.tva ?? "-"}</p>

                <h4 className="mt-4 font-semibold">Line Items:</h4>
                <table className="w-full text-left border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-2 py-1">Product</th>
                      <th className="border border-gray-400 px-2 py-1">Quantity</th>
                      <th className="border border-gray-400 px-2 py-1">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item, i) => (
                      <tr key={i}>
                        <td className="border border-gray-400 px-2 py-1">{item.product}</td>
                        <td className="border border-gray-400 px-2 py-1">{item.quantity}</td>
                        <td className="border border-gray-400 px-2 py-1">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Extracted Text Section */}
              {invoice.extractedText && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Extracted Text</h3>
                  <div className="overflow-auto max-h-64 border border-gray-500 rounded">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {invoice.extractedText
                          .split("\n")
                          .filter(line => line.trim() !== "")
                          .map((line, index) => (
                            <tr key={index} className="hover:bg-gray-600">
                              <td className="px-3 py-1 border-b border-gray-500 text-gray-400 w-12">
                                {index + 1}
                              </td>
                              <td className="px-3 py-1 border-b border-gray-500 text-gray-200">
                                {line}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
