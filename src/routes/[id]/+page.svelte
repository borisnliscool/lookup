<script lang="ts">
	import CfxUtils from '$lib/CfxUtils';
	import PlayerAlertDialog from '$lib/dialogs/PlayerAlertDialog.svelte';
	import { alertsStore } from '$lib/stores';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import Input from '$lib/ui/Input.svelte';
	import { notifications } from '$lib/ui/notifications';
	import Icon from '@iconify/svelte';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { CfxPlayer } from '../../app';
	import type { PageData } from './$types';
	import PlayerCard from './PlayerCard.svelte';

	import { Howl } from 'howler';

	export let data: PageData;

	let serverData = data.serverData;
	let autoRefresh = true;

	let playerSearch = '';
	let resourceSearch = '';
	let lastSearchAttempt = new Date();
	let now = new Date();

	let oldPlayers: CfxPlayer[] = [];
	$: players = getPlayerSearchResults(serverData.Data.players, playerSearch);
	$: resources = getResourceSearchResults(serverData.Data.resources, resourceSearch);

	const soundEffect = new Howl({
		src: ['/sounds/gta_online_tone.mp3'],
		volume: 0.1
	});

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
		return [
			...new Set([
				...fuseResults,
				...(trimmedSearch.length > 8
					? players.filter((p) => p.identifiers.some((i) => i.includes(trimmedSearch)))
					: [])
			])
		];
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

	const checkAlerts = async () => {
		const alerts = get(alertsStore);

		const newPlayers = players.filter((p) => !oldPlayers.find((op) => p.id == op.id));
		const removedPlayers = oldPlayers.filter((p) => !players.find((op) => p.id == op.id));

		const triggers: {
			type: 'join' | 'leave';
			username: string;
		}[] = [];

		for (const alert of alerts) {
			for (const player of newPlayers) {
				if (
					player.identifiers.some((i) => alert.identifiers.includes(i)) ||
					player.name.match(new RegExp(alert.nameMatcher, 'gi'))
				) {
					triggers.push({
						type: 'join',
						username: player.name
					});
				}
			}

			for (const player of removedPlayers) {
				if (
					player.identifiers.some((i) => alert.identifiers.includes(i)) ||
					player.name.match(alert.nameMatcher)
				) {
					triggers.push({
						type: 'leave',
						username: player.name
					});
				}
			}
		}

		if (triggers.length > 0) {
			for await (const trigger of triggers) {
				notifications.add({
					message: `Player ${trigger.username} ${trigger.type === 'join' ? 'joined' : 'left'}`,
					sound: soundEffect
				});

				await new Promise((r) => setTimeout(r, 500));
			}
		}
	};

	const update = async () => {
		lastSearchAttempt = new Date();

		const response = await fetch(
			`https://servers-frontend.fivem.net/api/servers/single/${serverData.EndPoint}`
		);
		const data = await response.json();

		oldPlayers = [...players];
		serverData = data;
		players = getPlayerSearchResults(serverData.Data.players, playerSearch);

		checkAlerts().then();
	};

	onMount(() => {
		checkAlerts().then();

		const interval = setInterval(() => {
			if (!autoRefresh) return;
			update().then();
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
	<div class="fixed left-0 top-0 h-1 w-full bg-black/25 shadow-sm backdrop-blur-sm">
		<div
			class="absolute h-1 bg-blue-500 transition-all"
			style="width: {(((lastSearchAttempt.getTime() - now.getTime()) * -1) / 60_000) * 100}%"
		/>
	</div>
{/if}

<div class="mx-auto w-full max-w-5xl py-16">
	<div class="flex flex-col gap-16 px-4 text-white">
		<a href="/" class="flex w-full items-center gap-8">
			<img class="w-24" src="/android-chrome-512x512.png" alt="logo" />

			<h1 class="text-2xl font-extrabold">Boris' FiveM Server Lookup</h1>
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
					class="h-24 w-24"
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
							class="flex w-fit items-center rounded border border-neutral-700 text-sm"
							href="https://cfx.re/join/{serverData.EndPoint}"
							target="_blank"
						>
							<div class="grid h-full place-items-center bg-neutral-700 px-3">Join</div>
							<div class="flex items-center gap-2 px-3 py-1.5">
								<Icon icon="fa6-solid:link" />
								cfx.re/join/{serverData.EndPoint}
							</div>
						</a>

						<a
							href={serverData.Data.ownerProfile}
							class="flex w-fit items-center rounded border border-neutral-700 text-sm"
							target="_blank"
						>
							<div class="grid h-full place-items-center bg-neutral-700 px-3">Owner</div>
							<div class="flex items-center gap-2 px-3 py-1.5">
								<img class="w-4" src={serverData.Data.ownerAvatar} alt="" />

								{serverData.Data.ownerName}
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="flex items-center justify-between text-2xl font-semibold">
				Players <span class="text-xl italic text-neutral-500">
					({serverData.Data.players.length}/{serverData.Data.sv_maxclients})
				</span>
			</h3>

			<div>
				<PlayerAlertDialog />
			</div>

			<div class="flex flex-col gap-4">
				<Input
					bind:value={playerSearch}
					class="w-full"
					label="Search query"
					placeholder="#id or player name"
					clearable={true}
				/>

				<div class="flex w-full flex-col gap-2">
					{#key players}
						{#each players as player}
							<PlayerCard {player} />
						{/each}
					{/key}
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<h3 class="flex items-center justify-between text-2xl font-semibold">
				Resources <span class="text-xl italic text-neutral-500">
					({serverData.Data.resources.length})
				</span>
			</h3>

			<Input
				bind:value={resourceSearch}
				class="w-full"
				label="Search query"
				placeholder="resource name"
				clearable={true}
			/>

			<div class="flex flex-wrap gap-1">
				{#each resources as resource}
					<div
						class="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-200"
					>
						{resource}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
