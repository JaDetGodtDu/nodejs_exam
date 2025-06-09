import { navigate } from "svelte-routing";
import { session } from "../stores/sessionStore";

const url = "http://localhost:8080/users";

export async function signup(username, password, email, petname) {
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

export async function login(username, password) {
    const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
    });

    if (response.ok) {
        const data = await response.json();
        session.set({
            isLoggedIn: true,
            userId: data.userId,
            isAdmin: data.isAdmin,
            username: data.username,
            email: data.email,
        });
        
        navigate("/petpage");
        return {success: true, message: `Login successful! Welcome ${username}!` };
    } else {
        const data = await response.json();
        return {success: false, message: data.error || "Login failed!" };
    } 
}

export async function logout() {
    const response = await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (response.ok) {
        session.set({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
            username: null,
            email: null,
        });
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("session");
        navigate("/");
        return {success: true, message: "Logout successful!" };
    } else {
        const data = await response.json();
        return {success: false, message: data.error || "Logout failed!" };
    }
}

export async function saveDeadPet(pet) {
    const response = await fetch("http://localhost:8080/users/pastPets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            name: pet.name,
            createdAt: pet.createdAt,
            diedAt: new Date(),
        }),
    })
    if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.message || "Failed to save dead pet!" };
    }
    return await response.json();
}

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

export async function changePassword(oldPassword, newPassword, confirmPassword) {
    if(newPassword !== confirmPassword) {
        return { message:"Passwords do not match" };
    }

    const response = await fetch(`${url}/updatePassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            oldPassword,
            newPassword,
        }),
    });

    const data = await response.json();
    
    if (response.ok) {
        return { success: true, message: data.message || "Password updated successfully!" };
    } else {
        return { success: false, message: data.message || "Password update failed!" };
    }
}

export async function deleteUser() {
    const response = await fetch(`${url}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
        return { success: true, message: data.message || 'User deleted successfully!' };
    } else {
        return { success: false, message: data.message || 'User deletion failed!' };
    }
}