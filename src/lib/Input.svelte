<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from './cn';

	type $$Props = HTMLInputAttributes & { label?: string; clearable?: boolean };

	export let label: string = '';
	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let clearable: $$Props['clearable'] = false;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<label for="search" class="flex flex-col gap-1">
	{label}

	<div class="relative">
		<input
			bind:value
			{placeholder}
			class={cn(
				'rounded border border-neutral-600 bg-transparent px-4 py-2 outline-none backdrop-blur-sm transition-all placeholder:text-neutral-700 focus:border-blue-500 focus:ring',
				className
			)}
		/>

		{#if clearable && value.length > 0}
			<button
				class="absolute right-0 top-0 grid aspect-square h-full place-items-center text-neutral-500 transition-colors hover:text-white"
				on:click={() => (value = '')}
			>
				<Icon icon="fa6-solid:xmark" />
			</button>
		{/if}
	</div>
</label>
