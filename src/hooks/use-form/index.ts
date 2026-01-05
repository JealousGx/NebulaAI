import { createFormHook } from "@tanstack/react-form"

import {
	Select,
	SubscribeButton,
	Switch,
	TextArea,
	TextField,
} from "@/components/form"

import { fieldContext, formContext } from "./form-context"

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		Select,
		TextArea,
		Switch,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
})
