// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { writable, type Writable } from 'svelte/store';

export function addToggleToBooleanStore(store: Writable<boolean>) {
	function toggle() {
		store.update((v) => !v);
	}

	function off() {
		store.set(false);
	}

	function on() {
		store.set(true);
	}

	return {
		toggle,
		on,
		off
	};
}

export function createToggleStore(defaultValue = false) {
	const store = writable(defaultValue);
	return { ...store, ...addToggleToBooleanStore(store) };
}
