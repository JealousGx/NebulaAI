import { atom } from "nanostores";

import type { ModalState } from ".";

const initialState: ModalState = {
	isOpen: false,
	params: null,
	modalId: null,
};

export const $modalState = atom<ModalState>(initialState);

/**
 * Open modal with optional params and a modal identifier.
 */
export function openCreateEndpointModal<T = unknown>(
	params?: T,
	modalId: string | null = null,
) {
	$modalState.set({
		isOpen: true,
		params: params ?? null,
		modalId,
	});
}

/**
 * Close modal and reset state
 */
export function closeCreateEndpointModal() {
	$modalState.set({
		isOpen: false,
		params: null,
		modalId: null,
	});
}

/**
 * Toggle modal
 */
export function toggleModal<T = unknown>(
	params?: T,
	modalId: string | null = null,
) {
	const current = $modalState.get();
	$modalState.set({
		isOpen: !current.isOpen,
		params: current.isOpen ? null : (params ?? null),
		modalId: current.isOpen ? null : modalId,
	});
}
