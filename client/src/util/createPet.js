const url = 'http://localhost:8080/pets';

export async function createPet(ownerId, name){
    const response = await fetch(`${url}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerId, name }),
    });

    if (!response.ok) {
        return { message: "Failed to create pet!" };
    }

    const data = await response.json();
    return data;
}