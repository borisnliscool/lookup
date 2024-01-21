<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import SvelteSeo from 'svelte-seo';
</script>

<main class="min-h-screen h-full bg-neutral-900 text-white">
	<slot />
</main>

<SvelteSeo
	title="Boris' FiveM Server Lookup"
	description="Simple webpage to view information about a FiveM server and it's players."
/>
