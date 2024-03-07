<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from './cn';

	type $$Props = HTMLInputAttributes & { label?: string };

	export let label: string = '';
	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['value'] = undefined;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<label for="search" class="flex flex-col gap-1">
	{label}

	<input
		bind:value
		{placeholder}
		class={cn(
			'rounded border border-neutral-600 bg-transparent px-4 py-2 outline-none backdrop-blur-sm transition-all placeholder:text-neutral-700 focus:border-blue-500 focus:ring',
			className
		)}
	/>
</label>
