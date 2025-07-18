import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setError("");
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

        try {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) return prev + 10;
                    clearInterval(interval);
                    return prev;
                });
            }, 200);

            const res = await fetch("http://localhost:9090/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Upload failed");
            }

            const data = await res.json();
            setProgress(100);

            setTimeout(() => {
                router.push(`/results?id=${data.id || ""}`);
            }, 500);
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
            <main className="flex-1 p-10 bg-gray-800">
                <h1 className="text-2xl font-bold mb-6">Smart Data Analysis Application</h1>

                {/* Upload section */}
                <div className="bg-gray-700 p-6 rounded-lg mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-xl font-semibold text-blue-400 mb-4"
                    >
                        Import a CSV file
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
                </div>

                {/* Static dashboard data */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Users</p>
                        <p className="text-2xl font-bold">100</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Clients</p>
                        <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Imports this week</p>
                        <p className="text-2xl font-bold">7</p>
                    </div>
                </div>

                <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold mb-2">Latest Imported Rows</p>
                    <table className="w-full text-sm">
                        <thead className="text-blue-400">
                        <tr>
                            <th className="text-left py-1">ID</th>
                            <th className="text-left py-1">Name</th>
                            <th className="text-left py-1">Age</th>
                            <th className="text-left py-1">Income</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Alice</td>
                            <td>30</td>
                            <td>70000</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Bob</td>
                            <td>25</td>
                            <td>50000</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Claire</td>
                            <td>40</td>
                            <td>60000</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
