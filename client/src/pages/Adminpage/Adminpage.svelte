<script>
    import './Adminpage.css';
    
    import { onMount } from "svelte";
    import { getAllUsers, 
             getSingleUser, 
             deleteUser,
             updateUser,
             getSinglePet,
             updatePet,
            } from "../../util/adminApi.js";
    import { showSuccess, showError } from '../../util/toaster';

    import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.svelte';
    let showConfirmDelete = false;
    
    let listOfUsers = [];

    onMount(async () => {
        listOfUsers = await getAllUsers();
    });

    let showModal = false;
    let selectedUser = null;
    let selectedUsersPet = null;
    let editUsername = "";
    let editEmail = "";
    let editPetName = "";

    async function openModal(userId) {
        selectedUser = await getSingleUser(userId);
        showModal = true;
        editUsername = selectedUser.username;
        editEmail = selectedUser.email;

        const userPet = await getSinglePet(selectedUser._id);
        selectedUsersPet = userPet.pet || null;
        editPetName = selectedUsersPet.name;
    }

    async function closeModal() {
        showModal = false;
        selectedUser = null;
    }

    async function handleUpdateUser() {
        const updatedUser = {
            ...selectedUser,
            username: editUsername,
            email: editEmail
        };

        const result = await updateUser(selectedUser._id, updatedUser);

        if (result.success) {
            listOfUsers = listOfUsers.map(user =>
                user._id === selectedUser._id
                ? { ...user, ...updatedUser }
                : user
            );
            showSuccess(result.message)
            closeModal();
        } else {
            showError(result.message);
            console.error("Failed to update user:", result.message);
        }
    }

    async function handleDeleteUser(userId) {
        const result = await deleteUser(userId);
        if (result.success) {
            listOfUsers = listOfUsers.filter(user => user._id !== userId);
            showSuccess(result.message);
            closeModal();
        } else {
            showError(result.message);
            console.error("Failed to delete user:", result.message);
        }
    }

    async function handleUpdatePet(petToUpdate = {}) {
        if (!selectedUsersPet) return;

        const result = await updatePet(selectedUsersPet._id, petToUpdate);

        if (result.success) {
            selectedUsersPet = { ...selectedUsersPet, ...petToUpdate };
            showSuccess(result.message);
        } else {
            showError(result.message);
            console.error("Failed to update pet:", result.message);
        }
    }
</script>

<div id="adminpage" class="page">
    <h1>Admin Page</h1>
    <div class="admin-users">
        <h2>All Users</h2>
        {#if listOfUsers.length === 0}
            <p>No users found.</p>
        {:else}
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {#each listOfUsers as user}
                        <tr on:click={() => openModal(user._id)} style="cursor:pointer;">
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
    {#if showModal && selectedUser}
        <div
            class="modal-backdrop"
            role="button"
            tabindex="0"
            aria-label="Close modal"
            on:click={closeModal}
            on:keydown={(event) => { if (event.key === 'Escape') closeModal(); }}
        ></div>
        <div class="modal">
            <h3>User Details</h3>
            <p><strong>ID:</strong> {selectedUser._id}</p>
            <label>
                <strong>Username:</strong>
                <input type="text" bind:value={editUsername} />
            </label><br>
            <label>
                <strong>Email:</strong>
                <input type="email" bind:value={editEmail} />
            </label>
            <p><strong>Admin:</strong> {selectedUser.isAdmin ? "Yes" : "No"}</p>
            <p><strong>Past Pets:</strong></p>

                {#each selectedUser.pastPets as pet}
                    <p>{pet.name}</p>
                {/each}

            <!-- <p><strong>Past Pets:</strong> {selectedUser.pastPets}</p> -->

            {#if selectedUsersPet}
                <div class="pet-info">
                    <h3>Pet Details</h3>
                    <p><strong>Pet ID:</strong> {selectedUsersPet._id}</p>
                    <label>
                        <strong>Pet Name:</strong>
                        <input type="text" bind:value={editPetName} required/>
                    </label>
                    <button on:click={() => {
                        if (!editPetName) {
                            showError("Pet name is required!");
                            return;
                        }
                        handleUpdatePet({ name: editPetName });
                    }}>Update Pet Name</button><br>
                    <p><strong>Health:</strong> {selectedUsersPet.health}</p>
                    <p><strong>Happiness:</strong> {selectedUsersPet.happiness}</p>
                    <p><strong>Hunger:</strong> {selectedUsersPet.hunger}</p>
                    <p><strong>Energy:</strong> {selectedUsersPet.energy}</p>
                    {#if selectedUsersPet.health === 0}
                        <button on:click={ () => handleUpdatePet({health:100}) }>Revive Pet</button>
                    {/if}
                </div>
            {:else}
                <p>No pet found for this user.</p>
            {/if}

            <button on:click={()=>{
                if (!editUsername || !editEmail) {
                    showError("Username and email are required!");
                    return;
                }
                handleUpdateUser()
            }}>Update</button>
            <button on:click={() => showConfirmDelete = true} style="margin-left:1em;">Delete</button>
            <button on:click={closeModal} style="margin-left:1em;">Close</button>

            <ConfirmModal 
                open={showConfirmDelete} 
                message={`Are you sure you want to delete ${selectedUser.username}'s account?`} 
                onConfirm={() => {
                    handleDeleteUser(selectedUser._id);
                    showConfirmDelete = false
                    }}
                onCancel={() => showConfirmDelete = false}
            />
        </div>
    {/if}     
</div>