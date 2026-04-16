<script lang="ts">
	type Props = {
		name: string;
		legend: string;
		value: number | undefined;
		disabled?: boolean;
		onchange: (value: number) => void;
	};

	let { name, legend, value, disabled = false, onchange }: Props = $props();

	const LEVELS = [1, 2, 3, 4, 5] as const;

	function handleChange(event: Event) {
		const target = event.currentTarget;
		if (!(target instanceof HTMLInputElement)) return;
		const next = Number(target.value);
		if (!Number.isInteger(next) || next < 1 || next > 5) return;
		onchange(next);
	}
</script>

<fieldset {disabled}>
	<legend>{legend}</legend>
	{#each LEVELS as level (level)}
		<label class:is-filled={value !== undefined && level <= value}>
			<input type="radio" {name} value={level} checked={value === level} onchange={handleChange} />
			<span class="sr-only">{level}</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 18 18"
				aria-hidden="true"
			>
				<g fill="currentColor">
					<path
						d="M13.4814 16.29C13.3623 16.29 13.2421 16.2617 13.1328 16.2041L8.99998 14.0322L4.86718 16.2041C4.61428 16.3364 4.30757 16.314 4.07717 16.147C3.84667 15.979 3.73148 15.6944 3.77928 15.4131L4.56928 10.8125L1.22648 7.55419C1.02238 7.35499 0.948182 7.05659 1.03698 6.78519C1.12488 6.51369 1.35928 6.31599 1.64248 6.27489L6.26158 5.60349L8.32697 1.41799C8.58087 0.906285 9.41878 0.906285 9.67268 1.41799L11.7381 5.60349L16.3572 6.27489C16.6404 6.31589 16.8748 6.51369 16.9627 6.78519C17.0516 7.05669 16.9773 7.35499 16.7732 7.55419L13.4304 10.8125L14.2204 15.4131C14.2683 15.6943 14.153 15.979 13.9225 16.147C13.7916 16.2417 13.6367 16.29 13.4814 16.29Z"
					/>
				</g>
			</svg>
		</label>
	{/each}
</fieldset>

<style>
	fieldset {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 0;
		padding: 0;
	}

	legend {
		float: left;
		padding-inline-end: 0.5rem;
	}

	label {
		cursor: pointer;
		color: currentColor;
		opacity: 0.4;
		line-height: 0;
	}

	label.is-filled {
		opacity: 1;
	}

	label:has(input:focus-visible) {
		outline: 2px solid currentColor;
		outline-offset: 2px;
		border-radius: 2px;
	}

	fieldset:disabled label {
		cursor: default;
	}

	input,
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
