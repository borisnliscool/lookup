<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Input from '$lib/Input.svelte';
	import Label from '$lib/Label.svelte';
	import { alertsStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import type { PlayerActivityAlert } from '../../app';

	const newPlayerAlert: PlayerActivityAlert = {
		nameMatcher: '',
		identifiers: []
	};

	let newIdentifier = '';

	const reset = () => {
		newPlayerAlert.nameMatcher = '';
		newPlayerAlert.identifiers = [];
		newIdentifier = '';
	};

	const addAlert = () => {
		newPlayerAlert.identifiers = [
			...new Set([...newPlayerAlert.identifiers, newIdentifier])
		].filter(Boolean);

		$alertsStore = [...$alertsStore, { ...newPlayerAlert }];

		reset();
	};
</script>

<Dialog title="Player Alerts">
	<svelte:fragment slot="trigger" let:toggle>
		<button
			class="flex items-center gap-3 rounded border border-neutral-700 px-4 py-2 text-sm backdrop-blur-sm"
			on:click={() => toggle()}
		>
			<Icon icon="fa6-solid:bell" />
			Player Alerts
		</button>
	</svelte:fragment>

	{#if $alertsStore.length > 0}
		<div class="flex max-h-72 flex-col gap-1 overflow-y-auto pr-2">
			{#each $alertsStore as item}
				<div
					class="flex items-center justify-between gap-4 rounded border border-neutral-700 p-2 px-3"
				>
					<div class="flex flex-col gap-1">
						<p class="font-semibold">{item.nameMatcher}</p>
						{#if item.identifiers.length > 0}
							<p class="text-wrap font-mono text-xs text-neutral-400">
								{item.identifiers.join(', ')}
							</p>
						{/if}
					</div>

					<button
						class="grid aspect-square w-8 place-items-center rounded text-center text-neutral-500 outline-none ring-red-500/25 focus:ring"
						on:click={() => ($alertsStore = $alertsStore.filter((i) => i !== item))}
					>
						<Icon icon="fa6-solid:xmark" />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<div
		class="flex flex-col gap-2 border-t-neutral-700"
		class:border-t={$alertsStore.length > 0}
		class:pt-4={$alertsStore.length > 0}
	>
		<Input
			bind:value={newPlayerAlert.nameMatcher}
			label="Name"
			placeholder="string or regex"
			class="w-full placeholder:text-neutral-500"
		/>

		<div class="space-y-1">
			<Label>Identifiers</Label>

			<div class="space-y-2">
				{#each newPlayerAlert.identifiers as identifier}
					<div class="flex w-full flex-grow flex-row items-center justify-center gap-2">
						<Input
							bind:value={identifier}
							class="w-full placeholder:text-neutral-500"
							placeholder="identifier"
						/>

						<button
							class="grid aspect-square w-10 place-items-center rounded bg-red-500 text-center text-white outline-none ring-red-500/25 focus:ring"
							on:click={() => {
								newPlayerAlert.identifiers = newPlayerAlert.identifiers.filter(
									(i) => i !== identifier
								);
							}}
						>
							<Icon icon="fa6-solid:xmark" />
						</button>
					</div>
				{/each}

				<div class="flex w-full flex-grow flex-row items-center justify-center gap-2">
					<Input
						class="w-full placeholder:text-neutral-500"
						placeholder="identifier"
						bind:value={newIdentifier}
					/>

					<button
						class="grid aspect-square w-10 place-items-center rounded bg-blue-500 text-center text-white outline-none focus:ring disabled:grayscale"
						disabled={!newIdentifier}
						on:click={() => {
							newPlayerAlert.identifiers = [...newPlayerAlert.identifiers, newIdentifier];
							newIdentifier = '';
						}}
					>
						<Icon icon="fa6-solid:plus" />
					</button>
				</div>
			</div>
		</div>
	</div>

	<button
		class="flex w-full place-items-center items-center justify-center gap-4 rounded bg-blue-500 py-2 text-center text-white outline-none focus:ring disabled:grayscale"
		on:click={() => addAlert()}
		disabled={!(newPlayerAlert.nameMatcher || newPlayerAlert.identifiers.length || newIdentifier)}
	>
		<Icon icon="fa6-solid:plus" />
		Add
	</button>
</Dialog>
