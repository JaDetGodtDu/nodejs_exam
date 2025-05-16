const url = "http://localhost:8080/users";

export async function updateUser( username, email) {
    const response = await fetch(`${url}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email })
    });

    const data = await response.json();
    if (response.ok) {
        return { success: true, message: data.message || "Update successful!" };
    } else {
        return { success: false, message: data.error || "Update failed!" };
    }
}