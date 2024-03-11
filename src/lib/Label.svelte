<script lang="ts">
	let forName: string = crypto.randomUUID();
	export { forName as for };
</script>

<label class="flex w-full flex-col gap-1" for={forName} {...$$restProps}>
	<slot />
</label>
