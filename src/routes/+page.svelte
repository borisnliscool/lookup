<script lang="ts">
	import { scale } from 'svelte/transition';

	let serverId = 'bdmdx4';
</script>

<div class="w-full min-h-screen grid place-items-center">
	<div class="flex flex-col gap-2">
		<h1 class="text-lg text-center font-semibold">Enter Server ID</h1>
		<input
			bind:value={serverId}
			class="px-4 py-2 border border-neutral-600 text-center rounded bg-transparent outline-none focus:ring focus:border-blue-500 transition-all"
		/>

		{#if serverId.length == 6}
			<a
				href="/{serverId}"
				class="bg-blue-500 py-2 rounded text-center text-white"
				transition:scale
			>
				Lookup
			</a>
		{/if}
	</div>
</div>
