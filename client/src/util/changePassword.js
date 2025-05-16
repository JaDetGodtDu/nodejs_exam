const url = "http://localhost:8080/users";

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