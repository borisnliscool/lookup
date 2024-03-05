<script lang="ts">
	import { scale } from 'svelte/transition';

	let serverId = 'bdmdx4';
</script>

<div class="grid min-h-screen w-full place-items-center">
	<div class="flex flex-col items-center gap-8">
		<h1 class="text-center text-2xl font-extrabold">Boris' FiveM Server Lookup</h1>

		<div class="flex max-w-xs flex-col gap-2">
			<input
				bind:value={serverId}
				placeholder="server id"
				class="rounded border border-neutral-600 bg-transparent px-4 py-2 text-center outline-none backdrop-blur-sm transition-all placeholder:text-neutral-700 focus:border-blue-500 focus:ring"
			/>

			{#if serverId.length == 6}
				<a
					href="/{serverId}"
					class="rounded bg-blue-500 py-2 text-center text-white"
					transition:scale
				>
					Lookup
				</a>
			{/if}
		</div>
	</div>
</div>
