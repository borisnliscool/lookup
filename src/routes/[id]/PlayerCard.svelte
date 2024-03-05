<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import type { CfxPlayer } from '../../app';
	import PlayerIdentifier from './PlayerIdentifier.svelte';

	export let player: CfxPlayer;

	let opened = false;
</script>

<div class="border border-neutral-700 bg-neutral-800 rounded" class:col-span-full={opened}>
	<button
		on:click={() => (opened = !opened)}
		class="w-full flex items-center justify-between px-4 py-3"
	>
		<p class="font-semibold">
			<span class="text-neutral-500 pr-1">[#{player.id}]</span>
			{player.name}
		</p>

		<div class="p-1 transition-all" class:rotate-180={opened}>
			<Icon icon="fa6-solid:angle-up" />
		</div>
	</button>

	{#if opened}
		<div class="px-4 pb-3" transition:slide>
			<div class="flex flex-col gap-1">
				<p class="font-semibold text-lg">Identifiers</p>

				<div class="flex flex-col gap-2 max-w-full">
					{#each player.identifiers as identifier}
						<PlayerIdentifier {identifier} />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
