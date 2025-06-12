<script>
  export let open = false;
  export let message = "Are you sure?";
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>

{#if open}
  <div class="modal-backdrop">
    <div class="modal">
      <p>{message}</p>
      <button on:click={onConfirm}>Yes</button>
      <button on:click={onCancel}>No</button>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  }
  .modal {
    background: #242424; 
    padding: 2rem; 
    border-radius: 8px; 
    box-shadow: 0 2px 10px #0002;
  }
</style>