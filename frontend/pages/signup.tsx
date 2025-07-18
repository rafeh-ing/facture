import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { registerUser } from "../lib/api/auth"; // adapte le chemin si besoin

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerUser(email, password);
            router.push("/login"); // redirige vers login après signup
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
            <h1 className="text-4xl font-extrabold mb-8 text-[#407BBF]">Create Account</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                {error && (
                    <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
                )}

                <label className="block mb-2 font-semibold" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#407BBF]"
                    placeholder="you@example.com"
                />

                <label className="block mb-2 font-semibold" htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#407BBF]"
                    placeholder="At least 6 characters"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 font-semibold rounded-md text-white ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#407BBF] hover:bg-[#305c9e]"
                    } transition-colors`}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>

            <p className="mt-6 text-gray-700">
                Already have an account?{" "}
                <Link href="/login" className="text-[#407BBF] hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}
