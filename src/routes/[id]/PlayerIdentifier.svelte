<script lang="ts">
	import Icon from '@iconify/svelte';

	export let identifier: string;

	$: [service, id] = identifier.split(':');
</script>

<p class="font-mono text-sm w-full break-all leading-none">
	{#if service == 'discord'}
		<a href="https://discord.com/users/{id}" target="_blank" class="flex items-center gap-4">
			<span class="text-xl">
				<Icon icon="bxl:discord-alt" />
			</span>
			{identifier}
		</a>
	{:else if service == 'steam'}
		<a
			href="https://steamcommunity.com/profiles/{BigInt(`0x${id}`)}"
			target="_blank"
			class="flex items-center gap-4"
		>
			<span class="text-xl">
				<Icon icon="bxl:steam" />
			</span>
			{identifier}
		</a>
	{:else if service == 'live' || service == 'xbl'}
		<p class="flex items-center gap-4">
			<span class="text-xl">
				<Icon icon="fa6-brands:xbox" />
			</span>

			{identifier}
		</p>
	{:else}
		<p class="flex items-center gap-4">
			<span class="text-xl">
				<Icon icon="simple-icons:fivem" />
			</span>

			{identifier}
		</p>
	{/if}
</p>
