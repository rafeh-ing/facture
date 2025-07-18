import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResultsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchResult = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`http://localhost:9090/api/results/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch results");

                const data = await res.json();
                setResult(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchResult();
    }, [id, router]);

    if (error) return <p className="text-red-500 p-4">{error}</p>;

    if (!result) return <p className="p-4">Loading results...</p>;

    return (
        <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-2xl mb-4">Your Results</h1>
            <pre className="bg-gray-800 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
    );
}
