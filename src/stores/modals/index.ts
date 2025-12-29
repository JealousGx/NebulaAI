export type ModalState<T = unknown> = {
	isOpen: boolean;
	params: T | null;
	modalId?: string | null;
};
