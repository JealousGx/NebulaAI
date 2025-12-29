import { useStore } from "@nanostores/react";

import {
	$modalState,
	closeCreateEndpointModal,
	openCreateEndpointModal,
	toggleModal,
} from "@/stores/modals/create-endpoint-modal.store";

export function useCreateEndpointModalState() {
	const modalState = useStore($modalState);
	return modalState;
}

export { closeCreateEndpointModal, openCreateEndpointModal, toggleModal };
