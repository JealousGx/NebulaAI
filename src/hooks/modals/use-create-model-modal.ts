import { useStore } from "@nanostores/react"

import {
	$modalState,
	closeCreateModelModal,
	openCreateModelModal,
	toggleModal,
} from "@/stores/modals/create-model-modal.store"

export function useCreateModelModalState() {
	const modalState = useStore($modalState)
	return modalState
}

export { closeCreateModelModal, openCreateModelModal, toggleModal }
