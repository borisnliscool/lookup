<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import { scale } from 'svelte/transition';

	let serverId = 'bdmdx4';
</script>

<div class="w-full min-h-screen grid place-items-center">
	<div class="flex flex-col gap-8 items-center">
		<h1 class="font-extrabold text-2xl text-center">Boris' FiveM Server Lookup</h1>

		<div class="max-w-xs flex flex-col gap-2">
			<input
				bind:value={serverId}
				placeholder="server id"
				class="px-4 py-2 border border-neutral-600 text-center rounded bg-transparent outline-none focus:ring focus:border-blue-500 transition-all placeholder:text-neutral-700"
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
</div>

<div class="fixed bottom-2 left-0 w-full grid place-items-center">
	<Footer />
</div>
