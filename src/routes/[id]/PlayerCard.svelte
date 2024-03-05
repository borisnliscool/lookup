<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import type { CfxPlayer } from '../../app';
	import PlayerIdentifier from './PlayerIdentifier.svelte';

	export let player: CfxPlayer;

	let opened = false;
</script>

<div
	class="rounded border border-neutral-700 bg-gradient-to-b from-neutral-700 to-neutral-800"
	class:col-span-full={opened}
>
	<button
		on:click={() => (opened = !opened)}
		class="flex w-full items-center justify-between px-4 py-3"
	>
		<p class="font-semibold">
			<span class="pr-1 text-neutral-500">[#{player.id}]</span>
			{player.name}
		</p>

		<div class="p-1 transition-all" class:rotate-180={opened}>
			<Icon icon="fa6-solid:angle-up" />
		</div>
	</button>

	{#if opened}
		<div class="px-4 pb-3" transition:slide>
			<div class="flex flex-col gap-1">
				<p class="text-lg font-semibold">Identifiers</p>

				<div class="flex max-w-full flex-col gap-2">
					{#each player.identifiers as identifier}
						<PlayerIdentifier {identifier} />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
