let url = "http://localhost:8080/pets/action";

export async function performPetAction(petId, action){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petId, action }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to perform action on pet');
    }

    const data = await response.json();
    return data;
}