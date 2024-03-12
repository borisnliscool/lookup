<script lang="ts">
	import { cn } from '$lib/cn';
	import Icon from '@iconify/svelte';

	let className: string | undefined | null = undefined;
	let dialogElement: HTMLDialogElement;

	export let opened = false;
	export let title: string;
	export let closable = true;
	export { className as class };

	const toggle = (value?: boolean) => {
		opened = value == undefined ? !opened : value;
	};

	const keyup = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			return closable && toggle();
		}
	};

	const click = (e: MouseEvent) => {
		if (!opened || !e.target || !closable) return;

		const rect = dialogElement.getBoundingClientRect();

		const clickedInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (!clickedInDialog) toggle();
	};

	$: dialogElement && (opened ? dialogElement.showModal() : dialogElement.close());
</script>

<svelte:body on:keyup={keyup} on:click|capture={click} />
<slot name="trigger" {toggle} />

<dialog
	bind:this={dialogElement}
	class={cn(
		'w-full max-w-lg rounded border border-neutral-700 bg-neutral-800 p-6 pt-4 text-sm text-white shadow-lg outline-none backdrop:bg-black/50',
		className
	)}
	{...$$restProps}
>
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-semibold">{title}</h1>

			{#if closable}
				<button
					class="grid aspect-square w-10 place-items-center rounded-full text-lg outline-none hover:bg-neutral-700/50"
					on:click={() => toggle(false)}
				>
					<Icon icon="fa6-solid:xmark" />
				</button>
			{/if}
		</div>

		<slot {toggle} {opened} />
	</div>
</dialog>
