const url = "http://localhost:8080/users";

export default async function signup(username, password, email) {
    const response = await fetch(`${url}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();
    if (response.ok) {
        return { success: true, message: data.message || "Signup successful!" };
    } else {
        return { success: false, message: data.error || "Signup failed!" };
    }
}