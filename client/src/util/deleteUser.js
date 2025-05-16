const url = 'http://localhost:8080/users';

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