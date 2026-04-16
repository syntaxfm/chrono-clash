// Placeholder picker for use while the real picker implementations are
// still in development. Wraps a native <input type="date"> so the
// participant flow can be exercised end-to-end now.
//
// Real picker web components will replace this class tag-by-tag (see
// pickers/register.ts). The contract they must satisfy is documented in
// engine/picker-protocol.ts: a `value: string` property and standard
// `input`/`change` events. The placeholder delegates both directly to its
// inner native input — the input's native `input`/`change` events bubble
// up to the wrapper unchanged, and the `value` property forwards to it.
export class PlaceholderDatePicker extends HTMLElement {
	#input: HTMLInputElement | undefined;

	get value(): string {
		return this.#input?.value ?? '';
	}

	set value(next: string) {
		if (this.#input) this.#input.value = next;
	}

	connectedCallback(): void {
		if (this.#input) return;
		const input = document.createElement('input');
		input.type = 'date';
		this.appendChild(input);
		this.#input = input;
	}

	disconnectedCallback(): void {
		this.#input = undefined;
	}
}
