let url = "http://localhost:8080/pets";

export async function fetchPet(ownerId) {
    const response = await fetch(`${url}?ownerId=${ownerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return {message: "Failed to fetch pets!"};
    }

    const data = await response.json();
    return data.pet;
}