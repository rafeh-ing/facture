// lib/api/auth.ts

const API_URL = "http://localhost:9090/api/auth"; // Update if needed

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
};

export const registerUser = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Registration failed");

    const data = await res.json();
    return data;
};
