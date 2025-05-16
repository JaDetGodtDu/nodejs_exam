import { navigate } from "svelte-routing";

const url = "http://localhost:8080/users";

export default async function signup(username, password, email, petname) {
    const response = await fetch(`${url}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();
    if (response.ok) {
        const userId = data.userId;
        
        if (userId && petname) {
            await fetch("http://localhost:8080/pets/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ownerId: userId, name: petname })
            });
        }

        navigate("/login");
        return { success: true, message: data.message || "Signup successful!" };
    } else {
        return { success: false, message: data.error || "Signup failed!" };
    }
}