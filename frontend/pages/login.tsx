import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { loginUser } from "../lib/api/auth";

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await loginUser(email, password);
            router.push("/upload");
            // Redirection après login
        } catch (err) {
            setError("Invalid email or password");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#dbeafe] to-[#f8fafc] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-[#1E2B3A] mb-6">
                    Welcome Back 👋
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#407BBF]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#407BBF]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#407BBF] text-white font-semibold py-2 rounded-md hover:bg-[#305a9c] transition-colors duration-200"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-700">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-[#407BBF] hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

