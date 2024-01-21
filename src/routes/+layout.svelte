<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import { dev } from '$app/environment';
	import SvelteSeo from 'svelte-seo';
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
</main>

<SvelteSeo
	title="Boris' FiveM Server Lookup"
	description="Simple webpage to view information about a FiveM server and it's players."
/>
