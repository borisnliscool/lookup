<script lang="ts">
	import CfxUtils from '$lib/CfxUtils';
	import Checkbox from '$lib/Checkbox.svelte';
	import Icon from '@iconify/svelte';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import type { CfxPlayer } from '../../app';
	import type { PageData } from './$types';
	import PlayerCard from './PlayerCard.svelte';

	export let data: PageData;

	let serverData = data.serverData;
	let autoRefresh = true;

	let playerSearch = '';
	let resourceSearch = '';
	let lastSearchAttempt = new Date();
	let now = new Date();

	const getPlayerSearchResults = (players: CfxPlayer[], search: string) => {
		const trimmedSearch = search.trim();

		if (trimmedSearch.startsWith('#')) {
			return players
				.filter((p) => p.id.toString().includes(trimmedSearch.replace(/\D/g, '')))
				.toSorted((a, b) => b.id - a.id);
		}

		if (trimmedSearch.length < 3) return players.toSorted((a, b) => b.id - a.id);

		const fuse = new Fuse(players, {
			keys: ['name']
		});

		const fuseResults = fuse.search(trimmedSearch).map((i) => i.item);
		return new Set([
			...fuseResults,
			...(trimmedSearch.length > 8
				? players.filter((p) => p.identifiers.some((i) => i.includes(trimmedSearch)))
				: [])
		]);
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

	onMount(() => {
		const interval = setInterval(() => {
			if (!autoRefresh) return;

			lastSearchAttempt = new Date();

			fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverData.EndPoint}`)
				.then((r) => r.json())
				.then((r) => (serverData = r));
		}, 60_000);

		const tickInterval = setInterval(() => {
			if (!autoRefresh) return;
			now = new Date();
		}, 100);

		return () => {
			clearInterval(interval);
			clearInterval(tickInterval);
		};
	});
</script>

{#if autoRefresh}
	<div
		class="fixed top-0 left-0 h-1 bg-blue-500 transition-all"
		style="width: {(((lastSearchAttempt.getTime() - now.getTime()) * -1) / 60_000) * 100}%"
	/>
{/if}

<div class="mx-auto py-16 w-full max-w-5xl">
	<div class="px-4 flex flex-col gap-16 text-white">
		<a href="/" class="w-full flex items-center gap-8">
			<img class="w-24" src="/android-chrome-512x512.png" alt="logo" />

			<h1 class="font-extrabold text-2xl">Boris' FiveM Server Lookup</h1>
		</a>

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

			<div class="flex gap-4">
				<img
					src="https://servers-live.fivem.net/servers/icon/{serverData.EndPoint}/{serverData.Data
						.iconVersion}.png"
					class="w-24 h-24"
					alt="server logo"
				/>

				<div class="flex flex-col gap-2">
					<h1 class="text-4xl font-extrabold">
						{@html CfxUtils.toColored(serverData.Data.hostname)}
					</h1>

					<div>
						{@html CfxUtils.toColored(serverData.Data.vars.sv_projectDesc)}
					</div>

					<div class="flex flex-wrap gap-2">
						<a
							class="w-fit border rounded border-neutral-700 text-sm flex items-center"
							href="https://cfx.re/join/{serverData.EndPoint}"
							target="_blank"
						>
							<div class="bg-neutral-700 h-full grid place-items-center px-3">Join</div>
							<div class="px-3 py-1.5 flex items-center gap-2">
								<Icon icon="fa6-solid:link" />
								cfx.re/join/{serverData.EndPoint}
							</div>
						</a>

						<a
							href={serverData.Data.ownerProfile}
							class="w-fit border rounded border-neutral-700 text-sm flex items-center"
							target="_blank"
						>
							<div class="bg-neutral-700 h-full grid place-items-center px-3">Owner</div>
							<div class="px-3 py-1.5 flex items-center gap-2">
								<img class="w-4" src={serverData.Data.ownerAvatar} alt="" />

								{serverData.Data.ownerName}
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="text-2xl font-semibold flex items-center justify-between">
				Players <span class="text-neutral-500 italic text-xl">
					({serverData.Data.players.length}/{serverData.Data.sv_maxclients})
				</span>
			</h3>

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
			<h3 class="text-2xl font-semibold flex items-center justify-between">
				Resources <span class="text-neutral-500 italic text-xl">
					({serverData.Data.resources.length})
				</span>
			</h3>

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
