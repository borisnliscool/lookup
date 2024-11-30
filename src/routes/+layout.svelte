<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import { dev } from '$app/environment';
	import NotificationsContainer from '$lib/ui/notifications/NotificationsContainer.svelte';
	import Icon from '@iconify/svelte';
	import SvelteSeo from 'svelte-seo';
	import type { PageData } from './$types';

	export let data: PageData;

	let showDeprecationWarning = true;
</script>

<svelte:head>
	{#if !dev}
		<script
			async
			src="https://analytics.boris.foo/script.js"
			data-website-id="f606a422-e919-4c3f-b7eb-941689d8a349"
		></script>
	{/if}
</svelte:head>

<main class="h-full min-h-screen bg-neutral-900 text-white pattern-topography-neutral-800/50">
	{#if showDeprecationWarning}
		<div
			class="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-orange-600 p-2 px-4 text-white"
		>
			<p>
				Due to changes in FiveM's API, this application will no longer work like it used to. You are
				still able to see online player names, but not their identifiers.
			</p>
			<button on:click={() => (showDeprecationWarning = false)}>
				<Icon icon="fa6-solid:xmark" />
			</button>
		</div>
	{/if}

	<slot />

	<footer class="w-full bg-gradient-to-t from-black/25 py-4 text-center text-xs text-neutral-400">
		<p>
			Copyright © {new Date().getFullYear()}
			<a href="https://boris.foo" target="_blank">boris.foo</a>, All rights reserved.
		</p>
		{#if data.commit}
			<p>
				Version: v{data.version}, commit:
				<a href="https://github.com/borisnliscool/lookup/commit/{data.commit}" target="_blank">
					{data.commit.substring(0, 6)}
				</a>
			</p>
		{/if}
	</footer>
</main>

<NotificationsContainer />

<SvelteSeo
	title="Boris' FiveM Server Lookup"
	description="Simple webpage to view information about a FiveM server and it's players."
/>
