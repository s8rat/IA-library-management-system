const API_BASE_URL = "http://localhost:5205/api"; // Update with your backend URL

const getHeaders = () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const login = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const getAllBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/Books`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

// Add more API methods as needed
