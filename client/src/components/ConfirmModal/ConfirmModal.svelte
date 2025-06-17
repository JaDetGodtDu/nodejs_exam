<script>
  	import './ConfirmModal.css';

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