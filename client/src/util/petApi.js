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

export async function performPetAction(petId, action){
    const response = await fetch(`${url}/action`, {
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

export async function fetchPet(ownerId) {
    const response = await fetch(`${url}?ownerId=${ownerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
}

export async function deletePet(petId) {
    const response = await fetch(`${url}/delete/${petId}`, {
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