<script lang="ts">
	import CfxUtils from '$lib/CfxUtils';
	import Checkbox from '$lib/Checkbox.svelte';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import type { CfxPlayer } from '../../app';
	import type { PageData } from './$types';
	import PlayerCard from './PlayerCard.svelte';

	export let data: PageData;

	let serverData = data.serverData;
	let autoRefresh = false;

	let playerSearch = '';
	let resourceSearch = '';

	const getPlayerSearchResults = (players: CfxPlayer[], search: string) => {
		if (search.startsWith('#')) {
			return players
				.filter((p) => p.id.toString().includes(search.replace(/\D/g, '')))
				.toSorted((a, b) => b.id - a.id);
		}

		if (search.length < 3) return players.toSorted((a, b) => b.id - a.id);

		const fuse = new Fuse(players, {
			keys: ['name']
		});

		return fuse.search(search).map((i) => i.item);
	};

	const getResourceSearchResults = (resources: string[], search: string) => {
		if (search.length <= 0) return resources.toSorted((a, b) => a.localeCompare(b));

		const _resources = resources.map((resource) => ({
			resource
		}));

		const fuse = new Fuse(_resources, {
			keys: ['resource']
		});

		return fuse.search(search).map((i) => i.item.resource);
	};

	$: players = getPlayerSearchResults(serverData.Data.players, playerSearch);
	$: resources = getResourceSearchResults(serverData.Data.resources, resourceSearch);

	$: console.log(resources);

	onMount(() => {
		const interval = setInterval(() => {
			if (!autoRefresh) return;

			fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverData.EndPoint}`)
				.then((r) => r.json())
				.then((r) => (serverData = r));
		}, 60_000);

		return () => clearInterval(interval);
	});
</script>

<div class="mx-auto py-16 w-full max-w-5xl">
	<div class="px-4 flex flex-col gap-16 text-white">
		<div class="flex flex-col gap-4">
			<div>
				<Checkbox bind:checked={autoRefresh} label="Auto refresh list" />
			</div>

			{#if serverData.Data.vars.banner_detail ?? serverData.Data.vars.banner_connecting}
				<img
					src={String(serverData.Data.vars.banner_detail ?? serverData.Data.vars.banner_connecting)}
					alt="connecting banner"
					class="rounded"
				/>
			{/if}

			<h1 class="text-4xl font-extrabold">
				{@html CfxUtils.toColored(serverData.Data.hostname)}
			</h1>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-2xl font-semibold">Players</h3>

			<div class="flex flex-col gap-4">
				<div class="w-full">
					<div class="flex flex-col gap-1">
						<label for="search">Search query</label>
						<input
							id="search"
							bind:value={playerSearch}
							placeholder="#id or player name"
							class="px-4 py-2 border border-neutral-600 rounded bg-transparent outline-none focus:ring focus:border-blue-500 transition-all placeholder:text-neutral-700"
						/>
					</div>
				</div>

				<div class="w-full flex flex-col gap-2">
					{#each players as player}
						<PlayerCard {player} />
					{/each}
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-2xl font-semibold">Resources</h3>

			<div class="flex flex-col gap-1">
				<label for="search">Search query</label>
				<input
					id="search"
					bind:value={resourceSearch}
					placeholder="resource name"
					class="px-4 py-2 border border-neutral-600 rounded bg-transparent outline-none focus:ring focus:border-blue-500 transition-all placeholder:text-neutral-700"
				/>
			</div>

			<div class="flex flex-wrap gap-1">
				{#each resources as resource}
					<div
						class="px-2 py-1 text-sm border border-neutral-700 bg-neutral-800 text-neutral-200 rounded"
					>
						{resource}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
