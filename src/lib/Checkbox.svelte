<script lang="ts">
	import Icon from '@iconify/svelte';

	export let id = Math.random().toString(36).slice(2, -1);
	export let checked = false;
	export let label = '';
</script>

<label for={id} class="flex items-center gap-2 cursor-pointer">
	<input type="checkbox" name="checkbox" {id} class="sr-only" bind:checked />

	<div
		class="w-6 aspect-square border rounded-md grid place-items-center transition-all text-white"
		class:bg-neutral-800={!checked}
		class:border-neutral-700={!checked}
		class:bg-blue-600={checked}
		class:border-blue-600={checked}
	>
		<span class="opacity-0 transition-all text-sm" class:opacity-100={checked}>
			<Icon icon="fa6-solid:check" />
		</span>
	</div>

	{#if label}
		<p class="select-none text-white">{label}</p>
	{/if}
</label>
