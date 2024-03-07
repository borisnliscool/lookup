<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { scale } from 'svelte/transition';

	let serverId = 'bdmdx4';
</script>

<div class="grid min-h-screen w-full place-items-center">
	<div class="flex flex-col items-center gap-8">
		<h1 class="text-center text-2xl font-extrabold">Boris' FiveM Server Lookup</h1>

		<div class="flex max-w-xs flex-col gap-2">
			<Input bind:value={serverId} class="w-full text-center" placeholder="server id" />

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
