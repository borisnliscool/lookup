<script lang="ts">
	import { alertsStore } from '$lib/stores';
	import { notifications } from '$lib/ui/notifications';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import type { CfxPlayer, PlayerActivityAlert } from '../../app';
	import PlayerIdentifier from './PlayerIdentifier.svelte';

	export let player: CfxPlayer;

	let opened = false;

	const addPlayerAlert = () => {
		const newPlayerAlert: PlayerActivityAlert = {
			nameMatcher: player.name,
			identifiers: player.identifiers
		};

		$alertsStore = [...$alertsStore, newPlayerAlert];

		notifications.add({
			type: 'success',
			message: `Added alert for ${player.name}`
		});
	};
</script>

<div
	class="rounded border border-neutral-700 bg-neutral-800 bg-gradient-to-b from-neutral-700/50 to-neutral-800"
	class:col-span-full={opened}
>
	<button
		on:click={() => (opened = !opened)}
		class="flex w-full items-center justify-between px-4 py-3"
	>
		<p class="select-text font-semibold">
			<span class="pr-1 text-neutral-500">[#{player.id}]</span>
			{player.name}
		</p>

		<div class="p-1 transition-all" class:rotate-180={opened}>
			<Icon icon="fa6-solid:angle-up" />
		</div>
	</button>

	{#if opened}
		<div class="flex flex-col gap-4 px-4 pb-3" transition:slide>
			{#if player.identifiers.length}
				<div class="flex flex-col gap-1">
					<p class="text-lg font-semibold">Identifiers</p>

					<div class="flex max-w-full flex-col gap-2">
						{#each player.identifiers as identifier}
							<PlayerIdentifier {identifier} />
						{/each}
					</div>
				</div>
			{/if}

			<div class="flex gap-2">
				<a
					class="flex w-fit items-center gap-2 rounded bg-blue-500 px-4 py-2 text-center text-xs text-white active:bg-blue-700"
					href="https://steamcommunity.com/search/users/#text={player.name}"
					target="_blank"
				>
					<Icon icon="fa6-brands:steam" />
					Search steam for this username
				</a>

				<button
					class="flex w-fit items-center gap-2 rounded bg-blue-500 px-4 py-2 text-center text-xs text-white active:bg-blue-700"
					on:click={addPlayerAlert}
				>
					<Icon icon="fa6-solid:bell" />
					Add Alert
				</button>
			</div>
		</div>
	{/if}
</div>
