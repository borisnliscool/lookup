<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import { dev } from '$app/environment';
	import SvelteSeo from 'svelte-seo';
	import type { PageData } from './$types';

	export let data: PageData;
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

<main class="min-h-screen h-full bg-neutral-900 text-white">
	<slot />

	<footer class="w-full text-center text-neutral-400 text-xs py-2">
		<p>
			Copyright © {new Date().getFullYear()} boris.foo, All rights reserved.
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

<SvelteSeo
	title="Boris' FiveM Server Lookup"
	description="Simple webpage to view information about a FiveM server and it's players."
/>
