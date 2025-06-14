const url = "http://localhost:8080/admin";

export async function getAllUsers() {
    const response = await fetch(`${url}/users`, {
        credentials: "include"
    });
    
    return await response.json();
}
export async function getSingleUser(id){
    const response = await fetch(`${url}/users/${id}`, {
        credentials: "include"
    });
    
    return await response.json();
}
export async function updateUser(id, updatedData) {
    const response = await fetch(`${url}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(updatedData)
    });
    
    if (response.ok) {
        return { success: true, message: "User updated successfully!" };
    } else {
        const data = await response.json();
        return { success: false, message: data.message || "Failed to update user!" };
    }
}
export async function deleteUser(id) {
    const response = await fetch(`${url}/users/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    
    if (response.ok) {
        return { success: true, message: "User deleted successfully!" };
    } else {
        const data = await response.json();
        return { success: false, message: data.message || "Failed to delete user!" };
    }
}
// export async function getAllPets() {
//     const response = await fetch(`${url}/pets`, {
//         credentials: "include"
//     });
    
//     return await response.json();
// }
export async function getSinglePet(ownerId) {
    const response = await fetch(`${url}/pets/${ownerId}`, {
        credentials: "include"
    });
    return await response.json();
}
export async function updatePet(petId, updatedData) {
    const response = await fetch(`http://localhost:8080/admin/pets/${petId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData)
    });
    if (response.ok) {
        return { success: true, message: "Pet updated successfully!" };
    } else {
        const data = await response.json();
        return { success: false, message: data.message || "Failed to update pet!" };
    }
}
// export async function deletePet(id) {
//     const response = await fetch(`${url}/pets/${id}`, {
//         method: "DELETE",
//         credentials: "include"
//     });
    
//     if (response.ok) {
//         return { success: true, message: "Pet deleted successfully!" };
//     } else {
//         const data = await response.json();
//         return { success: false, message: data.message || "Failed to delete pet!" };
//     }
// }