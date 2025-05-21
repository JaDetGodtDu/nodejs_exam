const url = 'http://localhost:8080/pets';

export async function deletePet(petId) {
    const response = await fetch(`${url}?petId=${petId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return { message: "Failed to delete pet!" };
    }

    const data = await response.json();
    return data;
}